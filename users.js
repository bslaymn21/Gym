/**
 * إدارة المستخدمين - صفحة المشرف فقط
 * هذا الملف يعمل فقط مع صفحة users.html
 */

// بيانات المستخدمين المخزنة
let allUsers = [];

// تهيئة صفحة المستخدمين
function initUsersPage() {
    // التحقق من أن المستخدم الحالي هو مشرف
    const user = getCurrentUser();
    if (!user || user.type !== 'admin') {
        showAlert('غير مصرح', 'هذه الصفحة للمشرفين فقط', false);
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
        return;
    }
    
    loadUsers();
    renderUsersTable();
    updateUsersStats();
}

// تحميل المستخدمين
function loadUsers() {
    try {
        // جلب المستخدمين من localStorage
        const savedUsers = localStorage.getItem('gymUsers');
        if (savedUsers) {
            allUsers = JSON.parse(savedUsers);
        } else {
            // إذا لم توجد بيانات، إنشاء بيانات افتراضية
            allUsers = [
                { 
                    id: 1, 
                    username: 'admin', 
                    password: '123456', 
                    name: 'المسؤول الرئيسي', 
                    type: 'admin', 
                    status: 'online',
                    created: '2024-01-01',
                    lastLogin: new Date().toISOString().split('T')[0],
                    permissions: ['all']
                },
                { 
                    id: 2, 
                    username: 'assistant1', 
                    password: '123456', 
                    name: 'المساعد الأول', 
                    type: 'assistant', 
                    status: 'online',
                    created: '2024-01-10',
                    lastLogin: new Date().toISOString().split('T')[0],
                    permissions: ['members', 'renew', 'dashboard', 'add_user']
                },
                { 
                    id: 3, 
                    username: 'viewer1', 
                    password: '123456', 
                    name: 'الزائر الأول', 
                    type: 'viewer', 
                    status: 'offline',
                    created: '2024-01-15',
                    lastLogin: '2024-01-18',
                    permissions: ['dashboard']
                }
            ];
            saveUsers();
        }
    } catch (error) {
        console.error('خطأ في تحميل المستخدمين:', error);
        allUsers = [];
    }
}

// حفظ المستخدمين
function saveUsers() {
    try {
        localStorage.setItem('gymUsers', JSON.stringify(allUsers));
        console.log('تم حفظ المستخدمين بنجاح');
    } catch (error) {
        console.error('خطأ في حفظ المستخدمين:', error);
    }
}

// تحديث الإحصائيات
function updateUsersStats() {
    const total = allUsers.length;
    const admins = allUsers.filter(u => u.type === 'admin').length;
    const assistants = allUsers.filter(u => u.type === 'assistant').length;
    const viewers = allUsers.filter(u => u.type === 'viewer').length;
    
    document.getElementById('totalUsers').textContent = total;
    document.getElementById('adminUsers').textContent = admins;
    document.getElementById('assistantUsers').textContent = assistants;
    document.getElementById('viewerUsers').textContent = viewers;
}

// توليد ID جديد للمستخدم
function generateUserId() {
    if (allUsers.length === 0) return 1;
    return Math.max(...allUsers.map(u => u.id)) + 1;
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    // فقط في صفحة users.html
    if (window.location.pathname.includes('users.html')) {
        initUsersPage();
    }
});

// دالات إضافية للمستخدمين (يتم تعريفها لاحقاً)
function renderUsersTable(filteredUsers = null) {
    // سيتم تعريفها في ملف users.html
    console.log('دالة renderUsersTable جاهزة');
}

function addNewUser(event) {
    // سيتم تعريفها في ملف users.html
    event.preventDefault();
    console.log('دالة addNewUser جاهزة');
}