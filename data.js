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

// تحميل البيانات عند بدء التشغيل
loadData();