document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');  // Lấy giá trị từ localStorage
    console.log(isLoggedIn);
    // Kiểm tra nếu isLoggedIn có giá trị 'true' (là chuỗi)
    if (isLoggedIn === 'true') {
        const userLink = document.querySelector('.zzz');
        userLink.href = '/account';  // Chuyển hướng đến trang thông tin tài khoản
        userLink.innerHTML = '<i class="fa-solid fa-user-graduate"></i>';  // Cập nhật biểu tượng nếu cần
    }
});
