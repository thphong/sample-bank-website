<script lang="ts">
  import { IndexedDb } from "$lib/libs/indexed-db";
  import favicon from "$lib/assets/favicon.svg";
  import { onMount, onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import { writable } from "svelte/store";
  import {
    navTabs,
    topMenu,
    mainMenu,
    WALLET_REQUEST_TYPE,
    DID,
  } from "$lib/contant/enum";
  let { children } = $props();
  const dbInstance: IndexedDb = IndexedDb.getInstance();
  // svelte-ignore non_reactive_update
  let hasValidSession = writable(false);

  // Khi user bấm nút Đăng nhập trên web
  function handleLoginClick() {
    // Gửi message cho content-script của extension
    window.postMessage(
      {
        source: "sample-bank-web",
        type: WALLET_REQUEST_TYPE.LOGIN_REQUEST,
        payload: {
          issuer: DID,
        },
      },
      "*",
    );
  }

  async function handleLogoutClick() {
    await dbInstance.saveValue("access-token", null);
    hasValidSession.set(false);
    goto("/");
  }

  // Khi user bấm nút Cấp VC trên web
  function handleIssueVCClick() {
    // Gửi message cho content-script của extension
    window.postMessage(
      {
        source: "sample-bank-web",
        type: WALLET_REQUEST_TYPE.VC_REQUEST,
        payload: {
          issuer: DID,
        },
      },
      "*",
    );
  }

  async function init() {
    const token = await dbInstance.getValue<any>("access-token");
    console.log("token", token);
    if (token) {
      hasValidSession.set(true);
    }
  }

  onMount(() => {
    init();
    const handler = async (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.source !== "ssi-wallet") return;

      if (data.type === WALLET_REQUEST_TYPE.LOGIN_SUCCESS) {
        //accessToken = data.token;
        console.log("Login success from extension", data);
        await dbInstance.saveValue("access-token", data.token);
        hasValidSession.set(true);
        goto("/home");
      } else if (data.type === WALLET_REQUEST_TYPE.LOGIN_FAILED) {
        console.error("Login failed from extension", data.error);
        alert("Login failed from extension, please try again.");
      }
    };

    window.addEventListener("message", handler);
    onDestroy(() => window.removeEventListener("message", handler));
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

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
      <div class="group-btn">
        {#if !$hasValidSession}
          <!-- svelte-ignore event_directive_deprecated -->
          <button class="action-btn login-btn" on:click={handleLoginClick}>
            <span>Đăng nhập</span>
          </button>
        {/if}
        <!-- svelte-ignore event_directive_deprecated -->
        <button class="action-btn vc-btn" on:click={handleIssueVCClick}>
          <span>Cấp VC</span>
        </button>
        {#if $hasValidSession}
          <!-- svelte-ignore event_directive_deprecated -->
          <button class="action-btn logout-btn" on:click={handleLogoutClick}>
            <span>Đăng xuất</span>
          </button>
        {/if}
      </div>
    </div>
  </header>

  <!-- HERO AREA -->
  <section class="hero">
    <div class="hero-bg"></div>
    <div class="hero-overlay"></div>

    <div class="hero-content">
      {@render children?.()}
    </div>
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

  .action-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    border: none;
    color: white;
    padding: 0.5rem 1.1rem;
    border-radius: 999px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.95rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
    margin-left: 10px;
  }

  .login-btn {
    background: #c5e86c;
  }

  .vc-btn {
    background: #f8851a;
  }

  .logout-btn {
    background: #f02c1a;
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
    padding: 1.5rem 1.25rem 3.5rem;
    display: flex;
    flex-direction: column;
    min-height: 480px;
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
  }
</style>
