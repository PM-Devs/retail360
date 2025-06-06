// Application state
const appState = {
    currentUser: null,
    isLoggedIn: false,
    charts: {}
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    setupEventListeners();
});

// Page navigation
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

// Check authentication status
function checkAuthStatus() {
    // For demo purposes, we'll use in-memory storage instead of localStorage
    if (appState.currentUser) {
        appState.isLoggedIn = true;
        showPage('dashboard');
        updateUserInfo();
        loadDashboardData();
    } else {
        showPage('login');
    }
}

// Update user info in dashboard
function updateUserInfo() {
    if (appState.currentUser) {
        document.getElementById('welcome-text').textContent = `Welcome back, ${appState.currentUser.name}!`;
        document.getElementById('user-info').textContent = appState.currentUser.shopName;
        document.getElementById('profile-name').textContent = appState.currentUser.name;
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.getElementById('toast-container').appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Setup event listeners
function setupEventListeners() {
    // Login form handler
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Signup form handler
    document.getElementById('signup-form').addEventListener('submit', handleSignup);
    
    // Chat input enter key
    document.getElementById('chat-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendAIMessage();
        }
    });
    
    // Form control animations
    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.settings-dropdown')) {
            const dropdown = document.getElementById('settings-dropdown');
            if (dropdown) {
                dropdown.classList.remove('show');
            }
        }
    });
    
    // Handle window resize for charts
    window.addEventListener('resize', debounce(handleChartResize, 250));
}

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle chart resize
function handleChartResize() {
    Object.values(appState.charts).forEach(chart => {
        if (chart && typeof chart.resize === 'function') {
            chart.resize();
        }
    });
}

// Login form handler
async function handleLogin(e) {
    e.preventDefault();
    
    const phone = document.getElementById('login-phone').value;
    const password = document.getElementById('login-password').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const loading = submitBtn.querySelector('.loading');
    
    // Show loading state
    btnText.style.display = 'none';
    loading.style.display = 'inline-block';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // For demo purposes, accept any phone/password combination
        if (phone && password) {
            const userData = {
                id: 1,
                name: 'John Doe',
                phone: phone,
                shopName: 'John\'s Mini Mart'
            };
            
            appState.currentUser = userData;
            appState.isLoggedIn = true;
            
            showToast('Login successful!', 'success');
            showPage('dashboard');
            updateUserInfo();
            loadDashboardData();
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        showToast('Login failed. Please try again.', 'error');
    } finally {
        // Hide loading state
        btnText.style.display = 'inline';
        loading.style.display = 'none';
        submitBtn.disabled = false;
    }
}

// Signup form handler
async function handleSignup(e) {
    e.preventDefault();
    
    const shopName = document.getElementById('shop-name').value;
    const ownerName = document.getElementById('owner-name').value;
    const phone = document.getElementById('signup-phone').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match!', 'error');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const loading = submitBtn.querySelector('.loading');
    
    // Show loading state
    btnText.style.display = 'none';
    loading.style.display = 'inline-block';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const userData = {
            id: Date.now(),
            name: ownerName,
            phone: phone,
            email: email,
            shopName: shopName
        };
        
        appState.currentUser = userData;
        appState.isLoggedIn = true;
        
        showToast('Account created successfully!', 'success');
        showPage('dashboard');
        updateUserInfo();
        loadDashboardData();
        
    } catch (error) {
        showToast('Signup failed. Please try again.', 'error');
    } finally {
        // Hide loading state
        btnText.style.display = 'inline';
        loading.style.display = 'none';
        submitBtn.disabled = false;
    }
}

// Load dashboard data
function loadDashboardData() {
    // Simulate loading dashboard stats
    setTimeout(() => {
        document.getElementById('today-sales').textContent = 'GH₵ 245.50';
        document.getElementById('total-products').textContent = '42';
        document.getElementById('low-stock').textContent = '3';
        document.getElementById('total-customers').textContent = '18';
        
        // Initialize charts with proper timing
        setTimeout(() => {
            initializeCharts();
        }, 100);
    }, 1000);
}

// Initialize charts with size constraints
function initializeCharts() {
    // Destroy existing charts first
    destroyCharts();
    
    // Wait for DOM to be ready and containers to be visible
    requestAnimationFrame(() => {
        initializeSalesChart();
        initializeStockChart();
        initializeInventoryChart();
        initializeTrendChart();
    });
}

// Destroy existing charts
function destroyCharts() {
    Object.values(appState.charts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    appState.charts = {};
}

// Get container dimensions safely
function getContainerDimensions(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return { width: 400, height: 300 };
    
    const rect = container.getBoundingClientRect();
    return {
        width: Math.max(rect.width || 400, 200),
        height: Math.max(rect.height || 300, 200)
    };
}

// Initialize Sales Chart with size constraints
function initializeSalesChart() {
    const canvas = document.getElementById('salesChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dimensions = getContainerDimensions('salesChart');
    
    // Set canvas size explicitly
    canvas.style.maxWidth = '100%';
    canvas.style.maxHeight = '300px';
    
    appState.charts.salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Sales (GH₵)',
                data: [120, 190, 300, 250, 200, 350, 245],
                borderColor: '#ff6b6b',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 2,
            layout: {
                padding: {
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#fff',
                        boxWidth: 12,
                        padding: 15
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: Math.max(...[120, 190, 300, 250, 200, 350, 245]) * 1.1,
                    ticks: {
                        color: '#fff',
                        maxTicksLimit: 6
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#fff',
                        maxTicksLimit: 7
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            elements: {
                point: {
                    radius: 4,
                    hoverRadius: 8
                }
            }
        }
    });
}

// Initialize Stock Chart with size constraints
function initializeStockChart() {
    const canvas = document.getElementById('stockChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size explicitly
    canvas.style.maxWidth = '100%';
    canvas.style.maxHeight = '300px';
    
    appState.charts.stockChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Drinks', 'Snacks', 'Bread', 'Toiletries', 'Others'],
            datasets: [{
                label: 'Stock Level',
                data: [45, 23, 67, 34, 28],
                backgroundColor: [
                    'rgba(255, 107, 107, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
                ],
                borderColor: [
                    '#ff6b6b',
                    '#36a2eb',
                    '#ffce56',
                    '#4bc0c0',
                    '#9966ff'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 2,
            layout: {
                padding: {
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#fff',
                        boxWidth: 12,
                        padding: 15
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 80,
                    ticks: {
                        color: '#fff',
                        maxTicksLimit: 6
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#fff',
                        maxRotation: 45
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

// Initialize Inventory Chart with size constraints
function initializeInventoryChart() {
    const canvas = document.getElementById('inventoryChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size explicitly
    canvas.style.maxWidth = '100%';
    canvas.style.maxHeight = '300px';
    
    appState.charts.inventoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['In Stock', 'Low Stock', 'Out of Stock'],
            datasets: [{
                data: [65, 25, 10],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(255, 99, 132, 0.8)'
                ],
                borderColor: [
                    '#4bc0c0',
                    '#ffce56',
                    '#ff6384'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1.5,
            layout: {
                padding: {
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#fff',
                        padding: 15,
                        boxWidth: 12,
                        usePointStyle: true
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// Initialize Trend Chart with size constraints
function initializeTrendChart() {
    const canvas = document.getElementById('trendChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size explicitly
    canvas.style.maxWidth = '100%';
    canvas.style.maxHeight = '300px';
    
    appState.charts.trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Items Sold',
                data: [85, 92, 78, 105],
                borderColor: '#36a2eb',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 2,
            layout: {
                padding: {
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#fff',
                        boxWidth: 12,
                        padding: 15
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 120,
                    ticks: {
                        color: '#fff',
                        maxTicksLimit: 6
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            elements: {
                point: {
                    radius: 4,
                    hoverRadius: 8
                }
            }
        }
    });
}

// Dashboard navigation
function showDashboard() {
    showToast('Already on dashboard', 'info');
}

// Toggle user profile dropdown
function toggleUserProfile() {
    showToast('Profile menu coming soon!', 'info');
}

// Toggle settings dropdown
function toggleSettings() {
    const dropdown = document.getElementById('settings-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// AI Chat functionality
function toggleAIChat() {
    const modal = document.getElementById('ai-chat-modal');
    const overlay = document.getElementById('chat-overlay');
    
    if (modal && overlay) {
        modal.classList.toggle('show');
        overlay.classList.toggle('show');
    }
}

// Send AI message
function sendAIMessage() {
    const input = document.getElementById('chat-input');
    if (!input) return;
    
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    input.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        const responses = [
            "I can help you track your inventory and sales. What would you like to know?",
            "Your sales are looking good today! Would you like me to generate a report?",
            "I notice you have 3 items with low stock. Should I help you create a reorder list?",
            "Based on your sales pattern, I recommend stocking up on drinks for the weekend.",
            "Would you like me to help you analyze your best-selling products?"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addChatMessage(randomResponse, 'ai');
    }, 1000);
}

// Add chat message
function addChatMessage(message, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = `
        <p>${message}</p>
        <span class="message-time">Now</span>
    `;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Logout function
function logout() {
    appState.currentUser = null;
    appState.isLoggedIn = false;
    
    // Destroy charts
    destroyCharts();
    
    showToast('Logged out successfully', 'success');
    showPage('login');
}

// Coming soon placeholder
function showComingSoon(feature) {
    showToast(`${feature} feature coming soon!`, 'info');
}