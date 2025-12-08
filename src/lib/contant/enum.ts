
export const navTabs = ["Cá nhân", "Tổ chức", "Khách hàng Ưu tiên"];

export const topMenu = [
    "Về Samplebank",
    "Tin tức",
    "Nhà đầu tư",
    "Mạng lưới",
    "Tuyển dụng",
];

export const mainMenu = [
    "Sản phẩm & Dịch vụ",
    "Công cụ & Tiện ích",
    "Liên hệ & Hỗ trợ",
    "Giao dịch an toàn",
];

export const quickActions = [
    { icon: "⭐", label: "Gợi ý sản phẩm" },
    { icon: "🔔", label: "Tin nổi bật" },
    { icon: "📝", label: "Đăng ký trực tuyến" },
    { icon: "🎁", label: "VCB Loyalty" },
    { icon: "🏷️", label: "Ưu đãi" },
];

export const WALLET_REQUEST_TYPE = {
    LOGIN_REQUEST: "SSI_WALLET_LOGIN_REQUEST",
    LOGIN_SUCCESS: "SSI_WALLET_LOGIN_SUCCESS",
    LOGIN_FAILED: "SSI_WALLET_LOGIN_FAILED",
    VC_REQUEST: "SSI_WALLET_VC_REQUEST",
}

const HOST = 'https://sample-bank-api.onrender.com';

export const APIS = {
    API_NONCE: `${HOST}/auth/nonce`,
    API_TOKEN: `${HOST}/auth/access-token`,
    API_VC_NONCE: `${HOST}/vc/nonce`,
    API_VC_ISSUE: `${HOST}/vc/request`,
    API_GET_BANK_ACCOUNT: `${HOST}/resource/me`
}

export const DID = 'did:iota:testnet:0x5e09e3061df51cfa2bcfd6ec250b13fe311a3a5ca42a097409ca5ed9cda67a0e'
