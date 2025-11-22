<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import { onMount, onDestroy } from "svelte";

  let { children } = $props();

  const navTabs = ["Cá nhân", "Tổ chức", "Khách hàng Ưu tiên"];

  const topMenu = [
    "Về Samplebank",
    "Tin tức",
    "Nhà đầu tư",
    "Mạng lưới",
    "Tuyển dụng",
  ];

  const mainMenu = [
    "Sản phẩm & Dịch vụ",
    "Công cụ & Tiện ích",
    "Liên hệ & Hỗ trợ",
    "Giao dịch an toàn",
  ];

  const quickActions = [
    { icon: "⭐", label: "Gợi ý sản phẩm" },
    { icon: "🔔", label: "Tin nổi bật" },
    { icon: "📝", label: "Đăng ký trực tuyến" },
    { icon: "🎁", label: "VCB Loyalty" },
    { icon: "🏷️", label: "Ưu đãi" },
  ];

  const LOGIN_REQUEST = "SSI_WALLET_LOGIN_REQUEST";
  const LOGIN_SUCCESS = "SSI_WALLET_LOGIN_SUCCESS";
  const LOGIN_FAILED = "SSI_WALLET_LOGIN_FAILED";
  const API_NONCE = "https://sample-bank-api.onrender.com/auth/nonce";
  const API_TOKEN = "https://sample-bank-api.onrender.com/auth/access-token";

  // Khi user bấm nút Đăng nhập trên web
  function handleLoginClick() {
    // Gửi message cho content-script của extension
    console.log("[WEB] clicked login, sending postMessage");
    window.postMessage(
      {
        source: "sample-bank-web",
        type: LOGIN_REQUEST,
        payload: {
          api_nonce: API_NONCE,
          api_token: API_TOKEN,
        },
      },
      "*"
    );
  }

  onMount(() => {
    const handler = (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.source !== "ssi-wallet") return;

      if (data.type === LOGIN_SUCCESS) {
        //accessToken = data.token;
        console.log("Login success from extension", data);
      }

      if (data.type === LOGIN_FAILED) {
        console.error("Login failed", data);
        alert("Đăng nhập thất bại, vui lòng thử lại.");
      }
    };

    window.addEventListener("message", handler);
    onDestroy(() => window.removeEventListener("message", handler));
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<!-- <div class="app">
  <header>
    <h1>⭐ SvelteKit Sample</h1>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  </header>
  <main>
    {@render children?.()}
  </main>
  <footer>© {new Date().getFullYear()} Sample</footer>
</div> -->

<main class="page">
  <!-- HEADER -->
  <header class="header">
    <!-- Top row: tabs + right info -->
    <div class="header-top">
      <div class="tabs">
        {#each navTabs as tab, i}
          <button class:active={i === 0}>{tab}</button>
        {/each}
      </div>

      <nav class="top-menu">
        {#each topMenu as item}
          <a href="#">{item}</a>
        {/each}
        <div class="hotline">
          <span class="phone-icon">📞</span>
          <span>1900 545454</span>
        </div>
        <button class="flag-btn" aria-label="Vietnamese"> 🇻🇳 </button>
      </nav>
    </div>

    <!-- Middle row: logo + main menu + login -->
    <div class="header-main">
      <div class="logo">
        <!-- Thay bằng <img src="/logo.png" alt="Logo" /> nếu có -->
        <div class="logo-mark"></div>
        <div class="logo-text">
          <span class="logo-name">Samplebank</span>
        </div>
      </div>

      <nav class="main-menu">
        {#each mainMenu as item, i}
          <div class="main-menu-item">
            <a href="#">{item}</a>
            {#if i < mainMenu.length - 1}
              <span class="caret">▾</span>
            {/if}
          </div>
        {/each}
      </nav>

      <!-- svelte-ignore event_directive_deprecated -->
      <button class="login-btn" on:click={handleLoginClick}>
        <span class="login-icon">⮕</span>
        <span>Đăng nhập</span>
      </button>
    </div>
  </header>

  <!-- HERO AREA -->
  <section class="hero">
    <div class="hero-bg"></div>
    <div class="hero-overlay"></div>

    <div class="hero-content">
      {@render children?.()}

      <!-- Bottom white bar with quick actions -->
      <div class="quick-actions">
        {#each quickActions as qa}
          <button class="quick-card">
            <div class="qa-icon">{qa.icon}</div>
            <div class="qa-label">{qa.label}</div>
          </button>
        {/each}
      </div>
    </div>

    <!-- Chat bot button -->
    <button class="chatbot-btn" aria-label="Chat bot">
      <div class="bot-face">
        <span class="bot-eyes">• •</span>
        <span class="bot-mouth">‿</span>
      </div>
    </button>
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
    background: #f5f7fb;
    color: #1c1c1c;
  }

  .page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* HEADER */
  .header {
    position: relative;
    z-index: 10;
    background: #ffffffcc;
    backdrop-filter: blur(10px);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  }

  .header-top,
  .header-main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0.35rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-top {
    font-size: 0.85rem;
    color: #4b4b4b;
  }

  .tabs {
    display: flex;
    gap: 0.5rem;
  }

  .tabs button {
    border: none;
    background: transparent;
    padding: 0.35rem 0.9rem;
    border-radius: 999px;
    cursor: pointer;
    font-size: 0.85rem;
    color: #4b4b4b;
    transition:
      background 0.2s,
      color 0.2s;
  }

  .tabs button.active {
    background: #00954c;
    color: #fff;
    font-weight: 600;
  }

  .top-menu {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .top-menu a {
    text-decoration: none;
    color: #4b4b4b;
    white-space: nowrap;
  }

  .hotline {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-weight: 600;
    color: #1c1c1c;
  }

  .phone-icon {
    font-size: 1rem;
  }

  .flag-btn {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 1.1rem;
  }

  .header-main {
    padding-bottom: 0.6rem;
    padding-top: 0.6rem;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.45rem;
  }

  .logo-mark {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: linear-gradient(135deg, #00954c, #7ac143);
  }

  .logo-text {
    display: flex;
    flex-direction: column;
  }

  .logo-name {
    font-weight: 700;
    color: #006837;
    letter-spacing: 0.02em;
  }

  .main-menu {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    font-size: 0.95rem;
  }

  .main-menu-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .main-menu a {
    text-decoration: none;
    color: #222;
    font-weight: 500;
  }

  .caret {
    font-size: 0.7rem;
    color: #666;
  }

  .login-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    border: none;
    background: #c5e86c;
    color: #1c1c1c;
    padding: 0.5rem 1.1rem;
    border-radius: 999px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.95rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  }

  .login-icon {
    display: inline-flex;
    transform: rotate(180deg);
  }

  /* HERO */
  .hero {
    position: relative;
    flex: 1;
    overflow: hidden;
    background: #000;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    background-image: url("/background-home.jpg"); /* đổi thành ảnh ruộng bậc thang của bạn */
    background-size: cover;
    background-position: center;
    filter: brightness(1.5);
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.15) 40%,
      rgba(0, 0, 0, 0.35) 100%
    );
  }

  .hero-content {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2.5rem 1.25rem 3.5rem;
    display: flex;
    flex-direction: column;
    min-height: 480px;
  }

  .quick-actions {
    background: #ffffff;
    border-radius: 32px 32px 0 0;
    padding: 5px;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 0.75rem;
    position: fixed;
    width: 75%;
    bottom: 20px;
  }

  .quick-card {
    border: none;
    background: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.6rem 0.25rem;
    border-radius: 18px;
    cursor: pointer;
    transition:
      background 0.2s,
      transform 0.1s;
  }

  .quick-card:hover,
  .main-menu-item:hover,
  .top-menu a:hover,
  .header-top .tabs button:hover {
    background: #f3f7f0;
    transform: translateY(-1px);
  }

  .qa-icon {
    font-size: 1.4rem;
  }

  .qa-label {
    font-size: 0.9rem;
    font-weight: 500;
    color: #333;
    text-align: center;
  }

  .chatbot-btn {
    position: absolute;
    right: 1.5rem;
    bottom: 1.75rem;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: none;
    background: #ffffff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .bot-face {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    background: linear-gradient(135deg, #00954c, #7ac143);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 0.75rem;
  }

  .bot-eyes {
    font-size: 0.85rem;
  }

  .bot-mouth {
    margin-top: -0.15rem;
  }

  /* RESPONSIVE */
  @media (max-width: 960px) {
    .header-top {
      display: none;
    }

    .header-main {
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .main-menu {
      flex: 1 1 100%;
      justify-content: center;
      flex-wrap: wrap;
      row-gap: 0.5rem;
    }

    .quick-actions {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 640px) {
    .quick-actions {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      border-radius: 24px 24px 0 0;
    }

    .chatbot-btn {
      width: 54px;
      height: 54px;
    }

    .bot-face {
      width: 40px;
      height: 40px;
    }
  }
</style>
