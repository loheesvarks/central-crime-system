const API = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api'
  : `${window.location.origin}/api`;
let currentRecordId = null;
let token = localStorage.getItem('token');
let uploadedPhotoUrl = null;

// Check authentication
if (!token) {
  window.location.href = 'login.html';
}

// Set user info
const user = JSON.parse(localStorage.getItem('user') || '{}');
document.getElementById('userInfo').textContent = `Welcome, ${user.username}`;

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// Tab switching
function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  
  document.getElementById(tabName + 'Tab').classList.add('active');
  event.target.classList.add('active');
  
  if (tabName === 'news') loadNews();
  if (tabName === 'records') loadRecords();
}

// News functionality
async function loadNews() {
  const state = document.getElementById('stateSelect').value;
  const container = document.getElementById('newsContainer');
  container.innerHTML = '<p style="text-align:center;color:white;">Loading news...</p>';
  
  try {
    const response = await fetch(`${API}/news?state=${state}`);
    const data = await response.json();
    
    if (data.articles && data.articles.length > 0) {
      container.innerHTML = data.articles.map(article => `
        <div class="news-card">
          <img src="${article.urlToImage || 'https://via.placeholder.com/400x200?text=No+Image'}" 
               class="news-image" alt="News">
          <div class="news-content">
            <h3 class="news-title">${article.title}</h3>
            <p class="news-description">${article.description || 'No description available'}</p>
            <div class="news-meta">
              <span class="news-source">${article.source.name}</span>
              <span>${new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>
            <a href="${article.url}" target="_blank" style="color:#667eea;text-decoration:none;font-size:14px;">Read more →</a>
          </div>
        </div>
      `).join('');
    } else {
      container.innerHTML = '<p style="text-align:center;color:white;">No news available. Please add your News API key in app.js</p>';
    }
  } catch (error) {
    container.innerHTML = '<p style="text-align:center;color:white;">Error loading news</p>';
  }
}

// Records functionality
async function loadRecords() {
  try {
    const response = await fetch(`${API}/records`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const records = await response.json();
    displayRecords(records);
  } catch (error) {
    console.error('Error loading records:', error);
  }
}

function displayRecords(records) {
  const container = document.getElementById('recordsGrid');
  
  if (records.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:white;">No records found</p>';
    return;
  }
  
  container.innerHTML = records.map(record => `
    <div class="record-card" onclick="viewDetails(${record.id})">
      <img src="${record.photo_url || 'https://via.placeholder.com/300x200?text=No+Photo'}" 
           class="record-photo" alt="${record.name}">
      <h3 class="record-name">${record.name}</h3>
      <p class="record-crime">🚨 ${record.crime}</p>
      <p class="record-info">📅 Crime Date: ${new Date(record.crime_date).toLocaleDateString()}</p>
      <p class="record-info">📍 State: ${record.state || 'N/A'}</p>
      <p class="record-info">👤 Age: ${record.age}</p>
      ${record.sentence_years ? `<p class="record-info">⚖️ Sentence: ${record.sentence_years} years</p>` : ''}
      <span class="status-badge status-${record.case_status}">${record.case_status.toUpperCase()}</span>
      <div class="record-actions" onclick="event.stopPropagation()">
        <button class="btn-edit" onclick="editRecord(${record.id})">Edit</button>
        <button class="btn-delete" onclick="deleteRecord(${record.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

// View detailed record
async function viewDetails(id) {
  try {
    const response = await fetch(`${API}/records/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const record = await response.json();
    
    const modal = document.getElementById('detailModal');
    const content = document.getElementById('detailContent');
    
    content.innerHTML = `
      <div class="detail-header">
        <img src="${record.photo_url || 'https://via.placeholder.com/250x300?text=No+Photo'}" 
             class="detail-photo" alt="${record.name}">
        <div class="detail-info">
          <h2 class="detail-name">${record.name}</h2>
          <p class="detail-crime">🚨 ${record.crime}</p>
          <div class="detail-row">
            <span class="detail-label">Birth Date:</span>
            <span class="detail-value">${new Date(record.born_date).toLocaleDateString()}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Age:</span>
            <span class="detail-value">${record.age} years</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Crime Date:</span>
            <span class="detail-value">${new Date(record.crime_date).toLocaleDateString()}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">State:</span>
            <span class="detail-value">${record.state || 'N/A'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Case Status:</span>
            <span class="detail-value"><span class="status-badge status-${record.case_status}">${record.case_status.toUpperCase()}</span></span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Sentence:</span>
            <span class="detail-value">${record.sentence_years ? record.sentence_years + ' years' : 'Not sentenced'}</span>
          </div>
          ${record.sentence_details ? `
          <div class="detail-row">
            <span class="detail-label">Details:</span>
            <span class="detail-value">${record.sentence_details}</span>
          </div>
          ` : ''}
        </div>
      </div>
      
      <div class="evidences-section">
        <h3>📁 Evidence Collection</h3>
        <div id="evidencesList">
          ${record.evidences && record.evidences.length > 0 ? 
            record.evidences.map(ev => {
              const isVideo = ev.file_url && /\.(mp4|avi|mov|wmv|mkv)$/i.test(ev.file_url);
              const isImage = ev.file_url && /\.(jpg|jpeg|png|gif|webp)$/i.test(ev.file_url);
              const isPDF = ev.file_url && /\.pdf$/i.test(ev.file_url);
              
              return `
              <div class="evidence-card">
                <div class="evidence-type" data-type="${ev.evidence_type.toLowerCase()}">${ev.evidence_type}</div>
                <div class="evidence-description">${ev.description}</div>
                ${ev.file_url ? `
                  ${isVideo ? `
                    <video src="${ev.file_url}" controls class="video-evidence" style="width:100%;max-width:500px;margin-top:10px;border-radius:8px;">
                      Your browser does not support video playback.
                    </video>
                  ` : isImage ? `
                    <img src="${ev.file_url}" alt="Evidence" style="max-width:300px;margin-top:10px;border-radius:8px;cursor:pointer;" onclick="window.open('${ev.file_url}', '_blank')">
                  ` : `
                    <a href="${ev.file_url}" target="_blank" class="evidence-file">
                      ${isPDF ? '📄' : '📎'} View ${isPDF ? 'Document' : 'File'} →
                    </a>
                  `}
                ` : ''}
                <div style="font-size:12px;color:#999;margin-top:8px;">
                  📅 Uploaded: ${new Date(ev.uploaded_at).toLocaleString()}
                </div>
              </div>
            `}).join('') : 
            '<p style="color:#999;">No evidence uploaded yet</p>'
          }
        </div>
        <button class="add-evidence-btn" onclick="showAddEvidenceForm(${record.id})">+ Add Evidence</button>
      </div>
    `;
    
    modal.style.display = 'block';
  } catch (error) {
    console.error('Error loading details:', error);
  }
}

function closeDetailModal() {
  document.getElementById('detailModal').style.display = 'none';
}

// Add/Edit Record Modal
function showAddModal() {
  document.getElementById('modalTitle').textContent = 'Add New Record';
  document.getElementById('recordForm').reset();
  document.getElementById('photoPreview').innerHTML = '';
  document.getElementById('photo_file').value = '';
  uploadedPhotoUrl = null;
  currentRecordId = null;
  document.getElementById('recordModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('recordModal').style.display = 'none';
}

function calcAge() {
  const dob = new Date(document.getElementById('born_date').value);
  const diff = Date.now() - dob.getTime();
  const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  document.getElementById('age').value = age;
}

async function editRecord(id) {
  try {
    const response = await fetch(`${API}/records/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const record = await response.json();
    
    document.getElementById('modalTitle').textContent = 'Edit Record';
    document.getElementById('name').value = record.name;
    document.getElementById('crime').value = record.crime;
    document.getElementById('born_date').value = record.born_date.substring(0, 10);
    document.getElementById('crime_date').value = record.crime_date.substring(0, 10);
    document.getElementById('age').value = record.age;
    document.getElementById('photo_url').value = record.photo_url || '';
    document.getElementById('state').value = record.state || 'Maharashtra';
    document.getElementById('sentence_years').value = record.sentence_years || '';
    document.getElementById('case_status').value = record.case_status;
    document.getElementById('sentence_details').value = record.sentence_details || '';
    
    // Show existing photo preview
    if (record.photo_url) {
      document.getElementById('photoPreview').innerHTML = `
        <div style="color:#28a745;margin-bottom:8px;">Current photo:</div>
        <img src="${record.photo_url}" alt="Current photo">
      `;
      uploadedPhotoUrl = record.photo_url;
    }
    
    currentRecordId = id;
    document.getElementById('recordModal').style.display = 'block';
  } catch (error) {
    console.error('Error loading record:', error);
  }
}

document.getElementById('recordForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const data = {
    name: document.getElementById('name').value,
    crime: document.getElementById('crime').value,
    born_date: document.getElementById('born_date').value,
    crime_date: document.getElementById('crime_date').value,
    age: document.getElementById('age').value,
    photo_url: uploadedPhotoUrl || document.getElementById('photo_url').value || null,
    state: document.getElementById('state').value,
    sentence_years: document.getElementById('sentence_years').value || null,
    case_status: document.getElementById('case_status').value,
    sentence_details: document.getElementById('sentence_details').value
  };
  
  console.log('Submitting record:', data);
  
  try {
    const url = currentRecordId ? `${API}/records/${currentRecordId}` : `${API}/records`;
    const method = currentRecordId ? 'PUT' : 'POST';
    
    console.log('Request URL:', url);
    console.log('Method:', method);
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    console.log('Response:', result);
    
    if (response.ok) {
      showToast('Record saved successfully!', 'success');
      closeModal();
      loadRecords();
    } else {
      showToast('Error: ' + (result.error || 'Failed to save record'), 'error');
      console.error('Error response:', result);
    }
  } catch (error) {
    alert('Connection error: ' + error.message);
    console.error('Error saving record:', error);
  }
});

async function deleteRecord(id) {
  if (!confirm('⚠️ Are you sure you want to delete this record? This action cannot be undone.')) return;
  
  try {
    await fetch(`${API}/records/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    showToast('Record deleted successfully', 'success');
    loadRecords();
  } catch (error) {
    showToast('Error deleting record', 'error');
    console.error('Error deleting record:', error);
  }
}

// Filters
function applyFilters() {
  const name = document.getElementById('filterName').value;
  const crime = document.getElementById('filterCrime').value;
  const state = document.getElementById('filterState').value;
  const status = document.getElementById('filterStatus').value;
  
  const params = new URLSearchParams();
  if (name) params.append('name', name);
  if (crime) params.append('crime', crime);
  if (state) params.append('state', state);
  if (status) params.append('status', status);
  
  fetch(`${API}/records?${params.toString()}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(displayRecords);
}

function clearFilters() {
  document.getElementById('filterName').value = '';
  document.getElementById('filterCrime').value = '';
  document.getElementById('filterState').value = '';
  document.getElementById('filterStatus').value = '';
  loadRecords();
}

// Add evidence form
function showAddEvidenceForm(recordId) {
  const evidencesList = document.getElementById('evidencesList');
  evidencesList.innerHTML += `
    <div class="evidence-card evidence-upload-section" id="evidenceForm">
      <h4 style="margin-bottom:15px;color:#667eea;">📎 Add New Evidence</h4>
      
      <label style="display:block;margin-bottom:5px;font-weight:600;">Evidence Type:</label>
      <select id="evidenceType" style="width:100%;margin-bottom:10px;padding:8px;">
        <option value="Fingerprint">👆 Fingerprint</option>
        <option value="DNA">🧬 DNA Sample</option>
        <option value="CCTV Footage">🎥 CCTV Footage</option>
        <option value="Photo Evidence">📷 Photo Evidence</option>
        <option value="Video Recording">🎬 Video Recording</option>
        <option value="Document">📄 Document</option>
        <option value="Witness Statement">📝 Witness Statement</option>
        <option value="Forensic Report">🔬 Forensic Report</option>
        <option value="Other">📎 Other</option>
      </select>
      
      <label style="display:block;margin-bottom:5px;font-weight:600;">Description:</label>
      <textarea id="evidenceDesc" placeholder="Detailed description of the evidence..." style="width:100%;margin-bottom:10px;padding:8px;" rows="3"></textarea>
      
      <label style="display:block;margin-bottom:5px;font-weight:600;">Upload Evidence File (Image/Video/PDF):</label>
      <input type="file" id="evidenceFileInput" accept="image/*,video/*,application/pdf" style="width:100%;margin-bottom:10px;">
      <div id="evidenceUploadPreview"></div>
      <input type="hidden" id="evidenceFileUrl">
      
      <div style="display:flex;gap:10px;margin-top:15px;">
        <button onclick="submitEvidence(${recordId})" style="flex:1;padding:10px 16px;background:#28a745;color:white;border:none;border-radius:6px;cursor:pointer;font-weight:600;">✓ Submit Evidence</button>
        <button onclick="document.getElementById('evidenceForm').remove()" style="flex:1;padding:10px 16px;background:#6c757d;color:white;border:none;border-radius:6px;cursor:pointer;font-weight:600;">✕ Cancel</button>
      </div>
    </div>
  `;
  
  // Add file upload handler
  document.getElementById('evidenceFileInput').addEventListener('change', handleEvidenceFileUpload);
}

async function handleEvidenceFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Check file size (50MB for videos)
  if (file.size > 50 * 1024 * 1024) {
    alert('File size must be less than 50MB');
    return;
  }
  
  const preview = document.getElementById('evidenceUploadPreview');
  const fileType = file.type.split('/')[0];
  
  preview.innerHTML = `
    <div class="upload-progress">
      <div class="loading-spinner"></div>
      <span style="margin-left:10px;">Uploading ${fileType === 'video' ? 'video' : 'file'}...</span>
    </div>
  `;
  
  const formData = new FormData();
  formData.append('evidence', file);
  
  try {
    const response = await fetch(`${API}/upload/evidence`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    const data = await response.json();
    
    if (response.ok) {
      document.getElementById('evidenceFileUrl').value = data.url;
      
      // Show preview based on file type
      if (fileType === 'video') {
        preview.innerHTML = `
          <div class="upload-success">✓ Video uploaded successfully!</div>
          <video src="${data.url}" controls class="video-evidence" style="max-width:100%;margin-top:10px;border-radius:8px;"></video>
        `;
      } else if (fileType === 'image') {
        preview.innerHTML = `
          <div class="upload-success">✓ Image uploaded successfully!</div>
          <img src="${data.url}" alt="Evidence" style="max-width:200px;margin-top:10px;border-radius:8px;">
        `;
      } else {
        preview.innerHTML = `<div class="upload-success">✓ File uploaded: ${file.name}</div>`;
      }
    } else {
      preview.innerHTML = `<div class="upload-error">Upload failed: ${data.error}</div>`;
    }
  } catch (error) {
    preview.innerHTML = '<div class="upload-error">Upload failed. Please try again.</div>';
    console.error('Upload error:', error);
  }
}

async function submitEvidence(recordId) {
  const type = document.getElementById('evidenceType').value;
  const description = document.getElementById('evidenceDesc').value;
  const file_url = document.getElementById('evidenceFileUrl').value;
  
  if (!type || !description) {
    alert('Please fill in evidence type and description');
    return;
  }
  
  try {
    await fetch(`${API}/records/${recordId}/evidence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ evidence_type: type, description, file_url })
    });
    
    closeDetailModal();
    alert('Evidence added successfully!');
  } catch (error) {
    console.error('Error adding evidence:', error);
  }
}

// Initialize
loadNews();


// Handle photo upload
async function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
  }
  
  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('File size must be less than 5MB');
    return;
  }
  
  const preview = document.getElementById('photoPreview');
  preview.innerHTML = '<div class="upload-progress">Uploading photo...</div>';
  
  const formData = new FormData();
  formData.append('photo', file);
  
  try {
    const response = await fetch(`${API}/upload/photo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    const data = await response.json();
    
    if (response.ok) {
      uploadedPhotoUrl = data.url;
      document.getElementById('photo_url').value = data.url;
      
      preview.innerHTML = `
        <div class="upload-success">✓ Photo uploaded successfully!</div>
        <img src="${data.url}" alt="Preview">
      `;
    } else {
      preview.innerHTML = `<div class="upload-error">Upload failed: ${data.error}</div>`;
    }
  } catch (error) {
    preview.innerHTML = '<div class="upload-error">Upload failed. Please try again.</div>';
    console.error('Upload error:', error);
  }
}

// Clear photo preview when modal closes
const originalCloseModal = closeModal;
closeModal = function() {
  document.getElementById('photoPreview').innerHTML = '';
  document.getElementById('photo_file').value = '';
  uploadedPhotoUrl = null;
  originalCloseModal();
};


// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;">
      <span style="font-size:20px;">${type === 'success' ? '✓' : '✕'}</span>
      <span>${message}</span>
    </div>
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add loading state to buttons
function setButtonLoading(button, loading) {
  if (loading) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.innerHTML = '<span class="loading-spinner" style="width:16px;height:16px;border-width:2px;"></span>';
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText;
  }
}


// Toast notification system
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;">
      <span style="font-size:20px;">${type === 'success' ? '✓' : '✗'}</span>
      <span>${message}</span>
    </div>
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add loading spinner CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideOutRight {
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);


// Update stats dashboard
function updateStats(records) {
  document.getElementById('totalRecords').textContent = records.length;
  document.getElementById('convictedCount').textContent = records.filter(r => r.case_status === 'convicted').length;
  document.getElementById('pendingCount').textContent = records.filter(r => r.case_status === 'pending').length;
  document.getElementById('acquittedCount').textContent = records.filter(r => r.case_status === 'acquitted').length;
}

// Override loadRecords to update stats
const originalLoadRecords = loadRecords;
loadRecords = async function() {
  try {
    const response = await fetch(`${API}/records`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const records = await response.json();
    updateStats(records);
    displayRecords(records);
  } catch (error) {
    console.error('Error loading records:', error);
  }
};
