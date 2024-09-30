
function renderPagination(currentPage, totalPages) {
    const paginationLimit = 5; // Số trang hiển thị tối đa
    let pages = [];

    // Thêm trang trước đó (Previous)
    if (currentPage > 1) {
        pages.push(`
            <li class="page-item">
                <button class="page-link" onclick="fetchJobs(${currentPage - 1})">Previous</button>
            </li>
        `);
    }

    // Nếu số lượng trang lớn hơn giới hạn phân trang
    if (totalPages > paginationLimit) {
        const startPage = Math.max(1, currentPage - Math.floor(paginationLimit / 2));
        const endPage = Math.min(totalPages, currentPage + Math.floor(paginationLimit / 2));

        // Nếu không bắt đầu từ trang 1 thì thêm "..."
        if (startPage > 1) {
            pages.push(`
                <li class="page-item">
                    <button class="page-link" onclick="fetchJobs(1)">1</button>
                </li>
                <li class="page-item disabled"><span class="page-link">...</span></li>
            `);
        }

        // Thêm các trang ở giữa
        for (let i = startPage; i <= endPage; i++) {
            pages.push(`
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <button class="page-link" onclick="fetchJobs(${i})">${i}</button>
                </li>
            `);
        }

        // Nếu không kết thúc ở trang cuối cùng thì thêm "..."
        if (endPage < totalPages) {
            pages.push(`
                <li class="page-item disabled"><span class="page-link">...</span></li>
                <li class="page-item">
                    <button class="page-link" onclick="fetchJobs(${totalPages})">${totalPages}</button>
                </li>
            `);
        }
    } else {
        // Nếu số lượng trang nhỏ hơn hoặc bằng giới hạn thì hiển thị toàn bộ
        for (let i = 1; i <= totalPages; i++) {
            pages.push(`
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <button class="page-link" onclick="fetchJobs(${i})">${i}</button>
                </li>
            `);
        }
    }

    // Thêm trang tiếp theo (Next)
    if (currentPage < totalPages) {
        pages.push(`
            <li class="page-item">
                <button class="page-link" onclick="fetchJobs(${currentPage + 1})">Next</button>
            </li>
        `);
    }

    return pages.join('');
}


// Lấy chuỗi truy vấn từ URL
const queryString = window.location.search;

// Tạo đối tượng URLSearchParams
const urlParams = new URLSearchParams(queryString);

// Lấy giá trị của tham số 'name' và 'age'
const query = urlParams.get('query');

function fetchJobs() {
    $.ajax({
        url: `https://jobproj.xelanthantoc.workers.dev/ai/job/search?res=${query}`, // URL API
        method: 'GET',
        xhrFields: {
            withCredentials: true // Để gửi cookies
        },
        success: function(result) {
            const jobsResult = result.results.results;
            const jobsList = document.getElementById('jobs-list');
            const jobPage = document.getElementById('pagination');
            const authButtons = document.getElementById('auth-buttons');
            const token = localStorage.getItem('token');

            console.log(result)

            // Hiển thị danh sách công việc
            if (jobsResult.length > 0) {
                jobsList.innerHTML = jobsResult.map(job =>
                    `<div class="col-xl-4 col-md-6">
                        <div class="ec-job-item d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center">
                                <img width="50" height="50" src="" alt=""
                                class="ec-job-img m-3" />
                            <div class="ec-job-item-content ms-3">
                                <a class="ec-job-name text-dark text-decoration-none" href="https://deadinside.pages.dev/public/details?id=${job.jobs.id}">${job.jobs.title}</a>
                                <div class="ec-job-content-tag mt-2 d-flex flex-wrap">
                                    <div class="ec-job-tag-item">${job.jobs.salary}</div>
                                </div>
                            </div>
                            </div>
                            <div class="ec-job-content-save-btn">
                                <button class="ec-job-save-btn rounded-circle">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="16"
                                        viewBox="0 0 12 16" fill="none">
                                        <path
                                            d="M0 2C0 0.895431 0.89543 0 2 0H10C11.1046 0 12 0.89543 12 2V15.5C12 15.6844 11.8985 15.8538 11.7359 15.9408C11.5733 16.0278 11.3761 16.0183 11.2226 15.916L6 13.1009L0.77735 15.916C0.623922 16.0183 0.42665 16.0278 0.264071 15.9408C0.101492 15.8538 0 15.6844 0 15.5V2ZM2 1C1.44772 1 1 1.44772 1 2V14.5657L5.72265 12.084C5.8906 11.972 6.1094 11.972 6.27735 12.084L11 14.5657V2C11 1.44772 10.5523 1 10 1H2Z"
                                            fill="black" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>`
                ).join('');
                
                // Cập nhật phân trang
                jobPage.innerHTML = renderPagination(currentPage, totalPages);
            } else {
                jobsList.innerHTML = 'Không có công việc nào.';
            }

            // Hiển thị các nút điều hướng dựa trên trạng thái đăng nhập
            if (token) {
                authButtons.innerHTML = `
                    <button class="btn" onclick="location.href='https://deadinside.pages.dev/public/profile'">Profile</button>
                    <button class="btn" onclick="logout()">Logout</button>
                `;

                $('#accountBT1').attr("href", "https://deadinside.pages.dev/public/profile");
                $('#accountBT2').attr("href", "https://deadinside.pages.dev/public/profile");
                
            } else {
                authButtons.innerHTML = `
                <a href="https://deadinside.pages.dev/public/login" class="ec-login-register-btn text-decoration-none font-primary d-flex align-items-center justify-content-center">
                    <span class="d-none d-xl-block">Đăng nhập / Đăng kí</span>
                    <svg class="d-xl-none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M15 14C15 14 16 14 16 13C16 12 15 9 11 9C7 9 6 12 6 13C6 14 7 14 7 14H15ZM7.02235 13C7.01888 12.9996 7.01403 12.999 7.00815 12.998C7.00538 12.9975 7.00266 12.997 7.00001 12.9965C7.00146 12.7325 7.16687 11.9669 7.75926 11.2758C8.31334 10.6294 9.28269 10 11 10C12.7173 10 13.6867 10.6294 14.2407 11.2758C14.8331 11.9669 14.9985 12.7325 15 12.9965C14.9973 12.997 14.9946 12.9975 14.9919 12.998C14.986 12.999 14.9811 12.9996 14.9777 13H7.02235Z" fill=""/>
                        <path d="M11 7C12.1046 7 13 6.10457 13 5C13 3.89543 12.1046 3 11 3C9.89543 3 9 3.89543 9 5C9 6.10457 9.89543 7 11 7ZM14 5C14 6.65685 12.6569 8 11 8C9.34315 8 8 6.65685 8 5C8 3.34315 9.34315 2 11 2C12.6569 2 14 3.34315 14 5Z" fill=""/>
                        <path d="M6.93593 9.27996C6.56813 9.16232 6.15954 9.07679 5.70628 9.03306C5.48195 9.01141 5.24668 9 5 9C1 9 0 12 0 13C0 13.6667 0.333333 14 1 14H5.21636C5.07556 13.7159 5 13.3791 5 13C5 11.9897 5.37724 10.958 6.08982 10.0962C6.33327 9.80174 6.61587 9.52713 6.93593 9.27996ZM4.92004 10.0005C4.32256 10.9136 4 11.9547 4 13H1C1 12.7393 1.16424 11.97 1.75926 11.2758C2.30468 10.6395 3.25249 10.0197 4.92004 10.0005Z" fill=""/>
                        <path d="M1.5 5.5C1.5 3.84315 2.84315 2.5 4.5 2.5C6.15685 2.5 7.5 3.84315 7.5 5.5C7.5 7.15685 6.15685 8.5 4.5 8.5C2.84315 8.5 1.5 7.15685 1.5 5.5ZM4.5 3.5C3.39543 3.5 2.5 4.39543 2.5 5.5C2.5 6.60457 3.39543 7.5 4.5 7.5C5.60457 7.5 6.5 6.60457 6.5 5.5C6.5 4.39543 5.60457 3.5 4.5 3.5Z" fill=""/>
                    </svg>
                </a>
                `;
            }
        },
        error: function(xhr, status, error) {
            console.error('Lỗi khi lấy danh sách công việc:', error);
        }
    });
}

async function logout() {
    try {
        const response = await fetch('https://jobproj.xelanthantoc.workers.dev/logout', {
            method: 'POST',
            credentials: 'include'
        });

        const result = await response.json();
        if (result.success) {
            localStorage.removeItem('token');
            location.href = 'https://deadinside.pages.dev/public/login';
        } else {
            alert('Đăng xuất không thành công');
        }
    } catch (error) {
        console.error('Lỗi khi đăng xuất:', error);
    }
}

document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.trim();
    window.location.href = `https://deadinside.pages.dev/public/search?query=${query}`
});

// Gọi hàm để tải dữ liệu khi trang được tải
fetchJobs();
  