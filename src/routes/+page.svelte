<div class="hero-text">
  <div class="greeting-icon">🌤️</div>
  <div>
    <h1>Chào buổi sáng</h1>
    <p>Quý khách đang tìm kiếm gì hôm nay?</p>
  </div>
</div>

<!-- Search bar -->
<div class="search-wrapper">
  <div class="search-box">
    <span class="search-icon">🔍</span>
    <input type="text" placeholder="Thẻ tín dụng, vay tiêu dùng,…" />
  </div>
</div>

<style>
  .hero-text {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    margin-top: 2rem;
    margin-bottom: 1.75rem;
  }

  .greeting-icon {
    font-size: 2.2rem;
  }

  .hero-text h1 {
    margin: 0;
    font-size: 2.1rem;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .hero-text p {
    margin: 0.25rem 0 0;
    color: #f6f7fa;
    font-size: 1rem;
  }

  .search-wrapper {
    max-width: 520px;
  }

  .search-box {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 999px;
    padding: 0.6rem 1.2rem;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
    gap: 0.7rem;
  }

  .search-icon {
    font-size: 1.1rem;
    color: #888;
  }

  .search-box input {
    border: none;
    outline: none;
    flex: 1;
    font-size: 0.95rem;
  }

  .search-box input::placeholder {
    color: #999;
  }

  @media (max-width: 640px) {
    .hero-text {
      flex-direction: row;
      align-items: flex-start;
    }

    .hero-text h1 {
      font-size: 1.6rem;
    }

    .search-wrapper {
      max-width: 100%;
    }
  }
</style>
