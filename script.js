/**
 * بيانات التطبيق الأساسية
 */

// المستخدمون
const users = [
    { 
        id: 1, 
        username: 'admin', 
        password: '123456', 
        name: 'المسؤول الرئيسي', 
        type: 'admin', 
        status: 'online' 
    },
    { 
        id: 2, 
        username: 'assistant', 
        password: '123456', 
        name: 'المساعد الرياضي', 
        type: 'assistant', 
        status: 'online' 
    },
    { 
        id: 3, 
        username: 'viewer', 
        password: '123456', 
        name: 'الزائر', 
        type: 'viewer', 
        status: 'offline' 
    }
];

// الباقات
const packages = [
    { id: 1, name: 'باقة شهرية', price: 300, duration: 30 },
    { id: 2, name: 'باقة ربع سنوية', price: 800, duration: 90 },
    { id: 3, name: 'باقة نصف سنوية', price: 1500, duration: 180 },
    { id: 4, name: 'باقة سنوية', price: 2800, duration: 365 }
];

// الاشتراكات
var subscriptions = [];

// النشاطات
var activities = [];

// الإشعارات
var notifications = [];

/**
 * ============================================
 * الدوال الأساسية للمصادقة
 * ============================================
 */

/**
 * دالة تسجيل الدخول
 */
function login(username, password) {
    const user = users.find(u => u.username === username && u.password === password);
    return user || null;
}

/**
 * دالة الحصول على المستخدم الحالي
 */
function getCurrentUser() {
    try {
        const userData = localStorage.getItem('loggedInUser');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('خطأ في قراءة بيانات المستخدم:', error);
        return null;
    }
}

/**
 * دالة تسجيل الخروج
 */
function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = '../index.html';
}

/**
 * دالة التحقق من تسجيل الدخول
 */
function checkAuth() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        // توجيه إلى صفحة تسجيل الدخول
        if (!window.location.pathname.includes('index.html')) {
            window.location.href = '../index.html';
        }
        return false;
    }
    return currentUser;
}

/**
 * دالة التحقق من نوع المستخدم للصفحة الحالية
 */
function checkUserTypeAccess() {
    const user = getCurrentUser();
    if (!user) return false;
    
    const currentPath = window.location.pathname;
    
    // التحقق من المسار حسب نوع المستخدم
    if (user.type === 'admin' && !currentPath.includes('/admin/')) {
        window.location.href = 'admin/dashboard.html';
        return false;
    }
    
    if (user.type === 'assistant' && !currentPath.includes('/assistant/')) {
        window.location.href = 'assistant/dashboard.html';
        return false;
    }
    
    if (user.type === 'viewer' && !currentPath.includes('/viewer/')) {
        window.location.href = 'viewer/dashboard.html';
        return false;
    }
    
    return true;
}

/**
 * ============================================
 * الدوال المشتركة
 * ============================================
 */

/**
 * دالة عرض رسالة تأكيد
 */
function showAlert(title, message, isSuccess = true) {
    return new Promise((resolve) => {
        const alertHtml = `
            <div class="modal" id="customAlert">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="form-actions">
                        <button class="btn-confirm btn-primary">موافق</button>
                        <button class="btn-cancel btn-secondary">إلغاء</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', alertHtml);
        
        const alertEl = document.getElementById('customAlert');
        const confirmBtn = alertEl.querySelector('.btn-confirm');
        const cancelBtn = alertEl.querySelector('.btn-cancel');
        const closeBtn = alertEl.querySelector('.close-modal');
        
        const removeAlert = (confirmed) => {
            alertEl.remove();
            resolve(confirmed);
        };
        
        confirmBtn.addEventListener('click', () => removeAlert(true));
        cancelBtn.addEventListener('click', () => removeAlert(false));
        closeBtn.addEventListener('click', () => removeAlert(false));
        
        alertEl.classList.add('active');
    });
}

/**
 * دالة فتح نموذج منبثق
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

/**
 * دالة إغلاق نموذج منبثق
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * دالة تهيئة جميع النماذج المنبثقة
 */
function initModals() {
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) modal.classList.remove('active');
        });
    });
    
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
}

/**
 * دالة تحديث معلومات المستخدم في الواجهة
 */
function updateUserInfo(user) {
    const elements = {
        userName: document.getElementById('userName'),
        headerUserName: document.getElementById('headerUserName'),
        userRole: document.getElementById('userRole'),
        userStatus: document.getElementById('userStatus')
    };
    
    if (elements.userName) elements.userName.textContent = user.name;
    if (elements.headerUserName) elements.headerUserName.textContent = user.name;
    
    // تحديد الدور بناءً على نوع المستخدم
    let roleText = 'زائر';
    if (user.type === 'admin') roleText = 'مسؤول';
    if (user.type === 'assistant') roleText = 'مساعد';
    
    if (elements.userRole) elements.userRole.textContent = roleText;
    
    if (elements.userStatus) {
        elements.userStatus.textContent = user.status === 'online' ? 'متصل' : 'غير متصل';
        elements.userStatus.className = `status ${user.status}`;
    }
}

/**
 * دالة تحديث عدادات الإشعارات
 */
function updateNotificationCount() {
    const unreadCount = notifications.filter(n => !n.read).length;
    const notificationCount = document.getElementById('notificationCount');
    
    if (notificationCount) {
        notificationCount.textContent = unreadCount;
        notificationCount.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

/**
 * دالة تهيئة الصفحة الرئيسية
 */
function initPage() {
    // التحقق من المصادقة
    const user = checkAuth();
    if (!user) return;
    
    // التحقق من صلاحية الوصول للمسار
    if (!checkUserTypeAccess()) return;
    
    // تهيئة العناصر المشتركة
    updateUserInfo(user);
    updateNotificationCount();
    
    // تهيئة القائمة الجانبية إذا وجدت
    if (document.getElementById('sidebar')) {
        initSidebar();
    }
    
    // تهيئة النماذج إذا وجدت
    initModals();
    
    // تهيئة زر تسجيل الخروج
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // تحميل البيانات
    loadData();
}

/**
 * دالة تهيئة القائمة الجانبية
 */
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.add('active');
            if (overlay) overlay.classList.add('active');
        });
    }
    
    if (sidebarClose) {
        sidebarClose.addEventListener('click', () => {
            sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
}

/**
 * ============================================
 * إدارة البيانات
 * ============================================
 */

/**
 * تحميل البيانات من localStorage
 */
function loadData() {
    try {
        // تحميل الاشتراكات
        const savedSubscriptions = localStorage.getItem('gymSubscriptions');
        if (savedSubscriptions) {
            subscriptions = JSON.parse(savedSubscriptions);
        } else {
            // بيانات افتراضية
            subscriptions = [
                {
                    id: 'MEM001',
                    name: 'أحمد محمد',
                    age: 25,
                    gender: 'male',
                    phone: '01012345678',
                    package: 'باقة شهرية',
                    startDate: '2024-01-01',
                    endDate: '2024-02-01',
                    paymentMethod: 'كاش',
                    price: 300,
                    addedBy: 'admin',
                    status: 'active'
                }
            ];
        }
        
        // تحميل النشاطات
        const savedActivities = localStorage.getItem('gymActivities');
        if (savedActivities) {
            activities = JSON.parse(savedActivities);
        } else {
            activities = [
                {
                    id: 1,
                    type: 'اشتراك جديد',
                    user: 'أحمد محمد',
                    amount: 300,
                    date: '2024-01-01',
                    time: '10:30',
                    details: 'تم إضافة اشتراك جديد - باقة شهرية'
                }
            ];
        }
        
        // تحميل الإشعارات
        const savedNotifications = localStorage.getItem('gymNotifications');
        if (savedNotifications) {
            notifications = JSON.parse(savedNotifications);
        } else {
            notifications = [
                {
                    id: 1,
                    title: 'تجديد اشتراك',
                    message: 'اشتراك أحمد محمد ينتهي بعد 3 أيام',
                    date: '2024-01-15',
                    time: '09:00',
                    read: false
                }
            ];
        }
        
        console.log('تم تحميل البيانات بنجاح');
    } catch (error) {
        console.error('خطأ في تحميل البيانات:', error);
    }
}

/**
 * حفظ البيانات في localStorage
 */
function saveData() {
    try {
        localStorage.setItem('gymSubscriptions', JSON.stringify(subscriptions));
        localStorage.setItem('gymActivities', JSON.stringify(activities));
        localStorage.setItem('gymNotifications', JSON.stringify(notifications));
        console.log('تم حفظ البيانات بنجاح');
    } catch (error) {
        console.error('خطأ في حفظ البيانات:', error);
    }
}

/**
 * توليد كود عضو جديد
 */
function generateMemberId() {
    if (subscriptions.length === 0) return 'MEM001';
    
    const lastSubscription = subscriptions[subscriptions.length - 1];
    const lastId = lastSubscription.id;
    const num = parseInt(lastId.replace('MEM', '')) || 0;
    return `MEM${(num + 1).toString().padStart(3, '0')}`;
}

/**
 * ============================================
 * تهيئة النظام
 * ============================================
 */

// تحميل البيانات عند بدء التشغيل
loadData();

// إضافة حدث تحميل DOM
document.addEventListener('DOMContentLoaded', initPage);

// التأكد من وجود البيانات الأساسية
if (!localStorage.getItem('gymSubscriptions')) {
    localStorage.setItem('gymSubscriptions', JSON.stringify([]));
}

if (!localStorage.getItem('gymActivities')) {
    localStorage.setItem('gymActivities', JSON.stringify([]));
}

if (!localStorage.getItem('gymNotifications')) {
    localStorage.setItem('gymNotifications', JSON.stringify([]));
}