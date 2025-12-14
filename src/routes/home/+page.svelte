<script lang="ts">
  import { IndexedDb } from "$lib/libs/indexed-db";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import API from "$lib/libs/Interceptor";
  import { APIS } from "$lib/contant/enum";

  const dbInstance: IndexedDb = IndexedDb.getInstance();

  const user: any = {
    fullName: "",
    accountNumber: "",
    balance: 0,
    roles: [],
    permissions: {},
  };

  function formatCurrency(amount: number) {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }

  onMount(async () => {
    const token = await dbInstance.getValue<any>("access-token");
    if (!token) {
      goto("/");
    } else {
      const info = await API.get(APIS.API_GET_BANK_ACCOUNT);
      if (info && info.user) {
        user.fullName = info.user.fullname;
        user.accountNumber = info.user.account_number;
        user.balance = info.user.balance;

        let roles = [];

        if (info.user.roles.VIEW_ACCOUNT) {
          roles.push("Xem số dư và lịch sử");
        }
        if (info.user.roles.MAKE_TRANSACTION) {
          roles.push("Chuyển khoản");
        }
        user.roles = roles;
        user.permissions = info.user.roles;
      }
    }
  });
</script>

<main class="homepage">
  <!-- Thanh chào -->
  <section class="hero">
    <div class="hero-content">
      <p class="hero-subtitle">Chào mừng trở lại,</p>
      <h1 class="hero-title">{user.fullName}</h1>
      <p class="hero-text">
        Chúc bạn một ngày giao dịch an toàn và thuận lợi cùng <strong
          >Samplebank</strong
        >.
      </p>
    </div>
  </section>

  <!-- Thông tin tài khoản chính -->
  <section class="account-section">
    <div class="account-card">
      <div class="account-header">
        <div>
          <p class="account-label">Tài khoản thanh toán</p>
          <p class="account-number">{user.accountNumber}</p>
        </div>
        <span class="account-chip">Đang hoạt động</span>
      </div>
      {#if user.permissions.VIEW_ACCOUNT}
        <div class="account-balance">
          <p class="balance-label">Số dư khả dụng</p>
          <p class="balance-value">{formatCurrency(user.balance)}</p>
        </div>
      {/if}

      <div class="account-footer">
        {#if user.permissions.MAKE_TRANSACTION}
          <button class="primary-btn">Chuyển khoản</button>
        {/if}
        {#if user.permissions.VIEW_ACCOUNT}
          <button class="secondary-btn">Xem lịch sử</button>
        {/if}
      </div>
    </div>
  </section>

  <!-- Danh sách quyền / vai trò -->
  <section class="roles-section">
    <h2 class="section-title">Quyền truy cập của bạn</h2>
    {#if user.roles && user.roles.length > 0}
      <ul class="roles-list">
        {#each user.roles as role}
          <li class="role-item">
            <div class="role-icon">✔</div>
            <div class="role-text">{role}</div>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="no-roles">Bạn hiện chưa được cấp quyền nào.</p>
    {/if}
  </section>
</main>

<style>
  .homepage {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0rem 1.5rem 3rem;
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
  }

  .hero {
    background: linear-gradient(135deg, #0abf53, #57c97c);
    border-radius: 1.5rem;
    padding: 1.8rem 2rem;
    color: #fff;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  }

  .hero-subtitle {
    margin: 0;
    opacity: 0.9;
    font-size: 0.95rem;
  }

  .hero-title {
    margin: 0.25rem 0 0.5rem;
    font-size: 1.8rem;
    font-weight: 700;
  }

  .hero-text {
    margin: 0;
    font-size: 0.95rem;
    opacity: 0.95;
  }

  .account-section {
    margin-top: 1.8rem;
  }

  .account-card {
    background: #fff;
    border-radius: 1.25rem;
    padding: 1.6rem 1.8rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
    border: 1px solid #f0f0f0;
  }

  .account-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .account-label {
    margin: 0;
    font-size: 0.85rem;
    color: #777;
  }

  .account-number {
    margin: 0.15rem 0 0;
    font-weight: 600;
    font-size: 1.05rem;
    letter-spacing: 0.05em;
  }

  .account-chip {
    font-size: 0.75rem;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    background: #e6f9ee;
    color: #0a9f45;
    font-weight: 600;
  }

  .account-balance {
    margin-top: 1.3rem;
  }

  .balance-label {
    margin: 0;
    font-size: 0.85rem;
    color: #777;
  }

  .balance-value {
    margin: 0.3rem 0 0;
    font-size: 1.7rem;
    font-weight: 700;
    color: #222;
  }

  .account-footer {
    margin-top: 1.5rem;
    display: flex;
    gap: 0.75rem;
  }

  .primary-btn,
  .secondary-btn {
    border-radius: 999px;
    padding: 0.55rem 1.4rem;
    font-size: 0.9rem;
    border: none;
    cursor: pointer;
    font-weight: 600;
  }

  .primary-btn {
    background: #0abf53;
    color: #fff;
  }

  .primary-btn:hover {
    filter: brightness(0.95);
  }

  .secondary-btn {
    background: #f3f3f3;
    color: #333;
  }

  .secondary-btn:hover {
    background: #e6e6e6;
  }

  .roles-section {
    margin-top: 2.2rem;
  }

  .section-title {
    margin-bottom: 0.9rem;
    font-size: 1.1rem;
  }

  .roles-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 0.75rem;
  }

  .role-item {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.7rem 0.9rem;
    border-radius: 0.75rem;
    background: #fff;
    border: 1px solid #f0f0f0;
  }

  .role-icon {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    background: #e6f9ee;
    color: #0a9f45;
  }

  .role-text {
    font-size: 0.9rem;
  }

  .no-roles {
    font-size: 0.9rem;
    color: #777;
  }

  @media (max-width: 640px) {
    .homepage {
      padding: 1.5rem 1rem 2.5rem;
    }

    .hero {
      padding: 1.5rem 1.4rem;
    }

    .hero-title {
      font-size: 1.5rem;
    }

    .account-card {
      padding: 1.4rem 1.2rem;
    }

    .account-footer {
      flex-direction: column;
      align-items: stretch;
    }

    .primary-btn,
    .secondary-btn {
      width: 100%;
      text-align: center;
    }
  }
</style>
