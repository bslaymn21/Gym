/**
 * نظام المصادقة المتقدم
 * هذا الملف منفصل عن script.js ويحتوي على نظام المصادقة المتطور
 */

// دالة الحصول على صلاحيات كل نوع
function getPermissions(type) {
    const permissions = {
        'admin': ['all'],
        'assistant': ['members', 'renew', 'dashboard', 'add_user'],
        'viewer': ['dashboard']
    };
    return permissions[type] || ['dashboard'];
}

// دالة تسجيل الدخول المتقدمة
function advancedLogin(username, password) {
    // أولاً: جرب المصادقة العادية
    const user = login(username, password);
    
    if (user) {
        // إضافة المعلومات الإضافية للمستخدم
        if (!user.created) {
            user.created = new Date().toISOString().split('T')[0];
        }
        
        if (!user.permissions) {
            user.permissions = getPermissions(user.type || 'viewer');
        }
        
        // تحديث آخر دخول
        user.lastLogin = new Date().toISOString().split('T')[0];
        
        // حفظ المستخدم المحدث
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        
        // تحديث مصفوفة users الأصلية
        updateUserInArray(user);
        
        return user;
    }
    return null;
}

// تحديث المستخدم في المصفوفة الأصلية
function updateUserInArray(updatedUser) {
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
        // دمج الخصائص القديمة مع الجديدة
        users[index] = { ...users[index], ...updatedUser };
    } else {
        // إضافة مستخدم جديد إذا لم يكن موجوداً
        users.push(updatedUser);
    }
}

// دالة التحقق من الصلاحية
function hasPermission(permission) {
    const user = getCurrentUser();
    if (!user) return false;
    
    // المشرف لديه جميع الصلاحيات
    if (user.type === 'admin') return true;
    
    // التحقق من الصلاحيات
    return user.permissions.includes(permission) || user.permissions.includes('all');
}

// حماية الصفحات بناءً على الصلاحيات
function checkPagePermission(page) {
    const requiredPermissions = {
        'dashboard.html': ['dashboard'],
        'members.html': ['members'],
        'renew.html': ['renew'],
        'calendar.html': ['calendar'],
        'subscriptions.html': ['subscriptions'],
        'settings.html': ['settings'],
        'users.html': ['all'], // الصفحة هذه للمشرف فقط
        'notifications.html': ['all'] // للمشرف فقط
    };
    
    const user = getCurrentUser();
    if (!user) return false;
    
    // المشرف لديه جميع الصلاحيات
    if (user.type === 'admin') return true;
    
    const required = requiredPermissions[page];
    if (!required) return true;
    
    // التحقق إذا كان المستخدم لديه أي من الصلاحيات المطلوبة
    return required.some(perm => hasPermission(perm));
}

// دالة تهيئة الصفحة مع الحماية
function initProtectedPage() {
    // التحقق من المصادقة الأساسية
    const user = checkAuth();
    if (!user) return;
    
    // معرف اسم الصفحة الحالية
    const currentPage = window.location.pathname.split('/').pop();
    
    // التحقق من الصلاحية للصفحة الحالية
    if (!checkPagePermission(currentPage)) {
        showAlert('غير مصرح', 'ليس لديك صلاحية للوصول لهذه الصفحة', false);
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
        return;
    }
    
    // تحديث معلومات المستخدم مع الصلاحيات
    updateUserInfo(user);
    
    // إخفاء الروابط غير المسموحة في القائمة الجانبية
    hideUnauthorizedLinks(user);
    
    return user;
}

// إخفاء الروابط غير المسموحة في القائمة الجانبية
function hideUnauthorizedLinks(user) {
    const linksToHide = {
        'members.html': ['members'],
        'renew.html': ['renew'],
        'calendar.html': ['calendar'],
        'subscriptions.html': ['subscriptions'],
        'settings.html': ['settings'],
        'users.html': ['all'],
        'notifications.html': ['all']
    };
    
    // إخفاء القائمة الجانبية إذا كانت الصفحة الحالية هي users.html
    if (window.location.pathname.includes('users.html')) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && user.type !== 'admin') {
            sidebar.style.display = 'none';
        }
    }
    
    // إخفاء الروابط غير المسموحة
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href !== 'dashboard.html' && href !== 'index.html') {
            const page = href;
            const requiredPerms = linksToHide[page];
            
            if (requiredPerms) {
                const hasAccess = requiredPerms.some(perm => hasPermission(perm));
                if (!hasAccess) {
                    link.parentElement.style.display = 'none';
                }
            }
        }
    });
}

// دالة الحصول على نوع المستخدم كنص
function getUserTypeText(type) {
    const types = {
        'admin': 'مشرف',
        'assistant': 'مساعد',
        'viewer': 'زائر'
    };
    return types[type] || type;
}

// دالة الحصول على حالة المستخدم كنص
function getUserStatusText(status) {
    const statuses = {
        'online': 'متصل',
        'offline': 'غير متصل',
        'suspended': 'موقوف'
    };
    return statuses[status] || status;
}

// دالة الحصول على نص الصلاحية
function getPermissionText(permission) {
    const permissions = {
        'all': 'جميع الصلاحيات',
        'members': 'إدارة الأعضاء',
        'renew': 'تجديد الاشتراكات',
        'dashboard': 'لوحة التحكم',
        'calendar': 'التقويم',
        'subscriptions': 'الاشتراكات',
        'settings': 'الإعدادات',
        'add_user': 'إضافة مستخدمين'
    };
    return permissions[permission] || permission;
}

// دالة التحقق إذا كان المستخدم قادراً على إضافة مستخدمين
function canAddUsers() {
    return hasPermission('add_user') || hasPermission('all');
}

// دالة التحقق إذا كان المستخدم قادراً على إدارة الأعضاء
function canManageMembers() {
    return hasPermission('members') || hasPermission('all');
}

// دالة التحقق إذا كان المستخدم قادراً على تجديد الاشتراكات
function canRenewSubscriptions() {
    return hasPermission('renew') || hasPermission('all');
}

// تهيئة الصفحة المحمية
document.addEventListener('DOMContentLoaded', function() {
    // التحقق إذا كنا في صفحة index (تسجيل الدخول)
    if (window.location.pathname.includes('index.html')) {
        // لا نحتاج إلى حماية صفحة تسجيل الدخول
        return;
    }
    
    // لصفحات أخرى، استخدام الحماية
    const user = initProtectedPage();
    
    if (user) {
        console.log('تم تحميل الصفحة مع الحماية للمستخدم:', user.name);
    }
});
