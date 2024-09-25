document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("login-btn");
    const signupBtn = document.getElementById("signup-btn");
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const formSlider = document.querySelector(".form-slider");

    loginBtn.addEventListener("click", function () {
        // Switch to Login
        loginForm.classList.add("active");
        signupForm.classList.remove("active");


        // Update button styles
        loginBtn.classList.add("active");
        signupBtn.classList.remove("active");
    });

    signupBtn.addEventListener("click", function () {
        // Switch to Sign Up
        signupForm.classList.add("active");
        loginForm.classList.remove("active");


        // Update button styles
        signupBtn.classList.add("active");
        loginBtn.classList.remove("active");
    });
});


// Xử lý gửi biểu mẫu đăng nhập
document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://localhost:44342/api/User/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        });
        const data = await response.json();
        if (data.isCreated) {
            alert('Đăng nhập thành công');
        } else {
            alert('Đăng nhập thất bại: ' + data.message);
        }
    } catch (error) {
        console.error('Lỗi:', error);
    }
});

// Xử lý gửi biểu mẫu đăng ký
document.getElementById('signup-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của form
    const email = document.getElementById('email-signup').value;
    const password = document.getElementById('password-signup').value;

    try {
        const response = await fetch('https://localhost:44342/api/User/AddUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        });

        const data = await response.json();
        if (data.isCreated) {
            alert('Tạo tài khoản thành công');
            // Có thể chuyển hướng đến trang đăng nhập hoặc trang khác
        } else {
            alert('Tạo tài khoản thất bại: ' + data.message);
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Đã xảy ra lỗi trong quá trình tạo tài khoản.');
    }
});


