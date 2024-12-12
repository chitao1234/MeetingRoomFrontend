import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    message: {
      // Common
      submit: 'Submit',
      cancel: 'Cancel',
      confirm: 'Confirm',
      delete: 'Delete',
      edit: 'Edit',
      
      // Auth
      login: 'Login',
      register: 'Register',
      username: 'Username',
      password: 'Password',
      
      // Meeting Room
      meetingRoom: 'Meeting Room',
      reservation: 'Reservation',
      startTime: 'Start Time',
      endTime: 'End Time',
      
      // Admin
      managementStr: 'Management',
      userManagement: 'User Management',
      roomManagement: 'Room Management',
      logManagement: 'Log Management',
      
      // Admin Dashboard
      adminDashboard: 'Admin Dashboard',
      users: 'Users',
      rooms: 'Rooms',
      reservations: 'Reservations',
      logs: 'Logs',
      createUser: 'Create User',
      editUser: 'Edit User',
      createRoom: 'Create Room',
      editRoom: 'Edit Room',
      rejectReservation: 'Reject Reservation',
      cleanupOldLogs: 'Cleanup Old Logs',
      rejectionReason: 'Rejection Reason:',
      daysToKeep: 'Days to Keep:',
      confirmReject: 'Confirm Reject',
      confirmCleanup: 'Confirm Cleanup',
      
      // Bookings
      myBookings: 'My Bookings',
      status: {
        all: 'ALL',
        pending: 'PENDING',
        approved: 'APPROVED',
        rejected: 'REJECTED'
      },
      bookingDetails: {
        subject: 'Subject',
        start: 'Start',
        end: 'End',
        date: 'Date',
        time: 'Time',
        room: 'Room',
        attendees: 'Attendees',
        rejectionReason: 'Rejection Reason'
      },
      cancelBooking: 'Cancel Booking',
      confirmCancel: 'Are you sure you want to cancel this booking?',
      
      // Home
      welcome: 'Welcome to Meeting Room Booking System',
      dashboard: {
        upcomingBookings: 'Your Upcoming Bookings',
        availableRooms: 'Available Rooms',
        totalBookings: 'Total Bookings'
      },
      actions: {
        bookRoom: 'Book a Room',
        viewBookings: 'View My Bookings'
      },
      
      // Auth - Login
      loggingIn: 'Logging in...',
      invalidCredentials: 'Invalid username or password',
      noAccount: "Don't have an account?",
      registerHere: 'Register here',
      
      // Profile
      editProfile: 'Edit Profile',
      changeAvatar: 'Change Avatar',
      saveChanges: 'Save Changes',
      email: 'Email',
      phone: 'Phone',
      
      // Register
      registering: 'Registering...',
      registrationFailed: 'Registration failed. Please try again.',
      haveAccount: 'Already have an account?',
      loginHere: 'Login here',
      
      // Rooms
      meetingRooms: 'Meeting Rooms',
      searchFilters: {
        startTimeOptional: 'Start Time (optional)',
        endTimeOptional: 'End Time (optional)',
        attendeesOptional: 'Attendees (optional)',
        searchAvailableRooms: 'Search Available Rooms',
        listRooms: 'List Rooms'
      },
      roomDetails: {
        room: 'Room',
        capacity: 'Capacity',
        people: 'people',
        size: 'Size',
        showDetails: 'Show Details',
        hideDetails: 'Hide Details',
        bookNow: 'Book Now',
        setTimeAndAttendees: 'Set time and attendees to book'
      },
      bookingModal: {
        bookRoom: 'Book Room',
        meetingSubject: 'Meeting Subject',
        numberOfAttendees: 'Number of Attendees',
        booking: 'Booking...',
        confirmBooking: 'Confirm Booking'
      },
      searchInfo: 'To book a room, please search with your time and attendee requirements first.',
      
      // Navigation
      nav: {
        home: 'Home',
        meetingRooms: 'Meeting Rooms',
        myBookings: 'My Bookings',
        admin: 'Admin',
        logout: 'Logout'
      },
      
      // Forms
      forms: {
        // Room Form
        roomName: 'Name:',
        capacity: 'Capacity:',
        area: 'Area (m²):',
        roomNumber: 'Room Number:',
        photo: 'Photo:',
        noImage: 'No image selected',
        uploadPhoto: 'Upload Photo',
        changePhoto: 'Change Photo',
        removePhoto: 'Remove',
        description: 'Description:',
        uploadError: 'Failed to upload image',
        
        // User Form
        role: 'Role:',
        roleUser: 'User',
        roleAdmin: 'Admin'
      },
      
      // Management
      management: {
        // Common
        createNew: 'Create New',
        search: 'Search',
        actions: 'Actions',
        noResults: 'No results found',
        
        // User Management
        userList: 'User List',
        totalUsers: 'Total Users:',
        
        // Room Management
        roomList: 'Room List',
        totalRooms: 'Total Rooms:',
        
        // Reservation Management
        reservationList: 'Reservation List',
        pendingReservations: 'Pending Reservations',
        approve: 'Approve',
        reject: 'Reject',
        
        // Log Management
        logList: 'Log List',
        filterByDate: 'Filter by Date',
        filterByType: 'Filter by Type',
        cleanup: 'Cleanup',
        from: 'From:',
        to: 'To:',
        apply: 'Apply',
        reset: 'Reset'
      }
    }
  },
  zh: {
    message: {
      // 通用
      submit: '提交',
      cancel: '取消',
      confirm: '确认',
      delete: '删除',
      edit: '编辑',
      
      // 认证
      login: '登录',
      register: '注册',
      username: '用户名',
      password: '密码',
      
      // 会议室
      meetingRoom: '会议室',
      reservation: '预约',
      startTime: '开始时间',
      endTime: '结束时间',
      
      // 管理
      managementStr: '管理',
      userManagement: '用户管理',
      roomManagement: '会议室管理',
      logManagement: '日志管理',
      
      // 管理仪表板
      adminDashboard: '管理仪表板',
      users: '用户',
      rooms: '会议室',
      reservations: '预约',
      logs: '日志',
      createUser: '创建用户',
      editUser: '编辑用户',
      createRoom: '创建会议室',
      editRoom: '编辑会议室',
      rejectReservation: '拒绝预约',
      cleanupOldLogs: '清理旧日志',
      rejectionReason: '拒绝原因：',
      daysToKeep: '保留天数：',
      confirmReject: '确认拒绝',
      confirmCleanup: '确认清理',
      
      // 预约
      myBookings: '我的预约',
      status: {
        all: '全部',
        pending: '待审核',
        approved: '已通过',
        rejected: '已拒绝'
      },
      bookingDetails: {
        subject: '主题',
        start: '开始',
        end: '结束',
        date: '日期',
        time: '时间',
        room: '会议室',
        attendees: '参会人数',
        rejectionReason: '拒绝原因'
      },
      cancelBooking: '取消预约',
      confirmCancel: '确定要取消这个预约吗？',
      
      // 首页
      welcome: '欢迎使用会议室预约系统',
      dashboard: {
        upcomingBookings: '即将到来的预约',
        availableRooms: '可用会议室',
        totalBookings: '总预约数'
      },
      actions: {
        bookRoom: '预约会议室',
        viewBookings: '查看我的预约'
      },
      
      // 认证 - 登录
      loggingIn: '正在登录...',
      invalidCredentials: '用户名或密码错误',
      noAccount: '还没有账号？',
      registerHere: '点击注册',
      
      // 个人资料
      editProfile: '编辑个人资料',
      changeAvatar: '更换头像',
      saveChanges: '保存更改',
      email: '邮箱',
      phone: '电话',
      
      // 注册
      registering: '正在注册...',
      registrationFailed: '注册失败，请重试',
      haveAccount: '已有账号？',
      loginHere: '点击登录',
      
      // 会议室
      meetingRooms: '会议室',
      searchFilters: {
        startTimeOptional: '开始时间（可选）',
        endTimeOptional: '结束时间（可选）',
        attendeesOptional: '参会人数（可选）',
        searchAvailableRooms: '搜索可用会议室',
        listRooms: '列出会议室'
      },
      roomDetails: {
        room: '房间号',
        capacity: '容纳人数',
        people: '人',
        size: '面积',
        showDetails: '显示详情',
        hideDetails: '隐藏详情',
        bookNow: '立即预约',
        setTimeAndAttendees: '请先设置时间和人数'
      },
      bookingModal: {
        bookRoom: '预约会议室',
        meetingSubject: '会议主题',
        numberOfAttendees: '参会人数',
        booking: '预约中...',
        confirmBooking: '确认预约'
      },
      searchInfo: '请先设置时间和人数要求以预约会议室。',
      
      // 导航
      nav: {
        home: '首页',
        meetingRooms: '会议室',
        myBookings: '我的预约',
        admin: '管理',
        logout: '退出'
      },
      
      // 表单
      forms: {
        // 会议室表单
        roomName: '名称：',
        capacity: '容纳人数：',
        area: '面积（平方米）：',
        roomNumber: '房间号：',
        photo: '照片：',
        noImage: '未选择图片',
        uploadPhoto: '上传照片',
        changePhoto: '更换照片',
        removePhoto: '删除',
        description: '描述：',
        uploadError: '上传图片失败',
        
        // 用户表单
        role: '角色：',
        roleUser: '用户',
        roleAdmin: '管理员'
      },
      
      // 管理
      management: {
        // 通用
        createNew: '新建',
        search: '搜索',
        actions: '操作',
        noResults: '未找到结果',
        
        // 用户管理
        userList: '用户列表',
        totalUsers: '用户总数：',
        
        // 会议室管理
        roomList: '会议室列表',
        totalRooms: '会议室总数：',
        
        // 预约管理
        reservationList: '预约列表',
        pendingReservations: '待审核预约',
        approve: '通过',
        reject: '拒绝',
        
        // 日志管理
        logList: '日志列表',
        filterByDate: '按日期筛选',
        filterByType: '按类型筛选',
        cleanup: '清理',
        from: '从：',
        to: '至：',
        apply: '应用',
        reset: '重置'
      }
    }
  }
}

const i18n = createI18n({
  locale: 'en', // set default locale
  fallbackLocale: 'en', // set fallback locale
  messages,
  legacy: false // you must specify 'legacy: false' option
})

export default i18n