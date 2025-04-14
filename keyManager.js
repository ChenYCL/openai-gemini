class KeyManager {
    constructor() {
      this.keys = [];
      this.currentIndex = 0;
      this.loadKeys();
    }
  
    loadKeys() {
      // 方式1: 加载命名规则的多个环境变量
      let index = 1;
      while (process.env[`GEMINI_API_KEY_${index}`]) {
        this.keys.push(process.env[`GEMINI_API_KEY_${index}`]);
        index++;
      }
  
      // 方式2: 从逗号分隔的单一环境变量加载
      if (this.keys.length === 0 && process.env.GEMINI_API_KEYS) {
        this.keys = process.env.GEMINI_API_KEYS.split(',').map(k => k.trim());
      }
  
      // 兼容原有单个密钥设置
      if (this.keys.length === 0 && process.env.GEMINI_API_KEY) {
        this.keys.push(process.env.GEMINI_API_KEY);
      }
  
      if (this.keys.length === 0) {
        console.warn('No Gemini API keys configured!');
      } else {
        console.log(`Loaded ${this.keys.length} Gemini API keys`);
      }
    }
  
    getNextKey() {
      if (this.keys.length === 0) {
        throw new Error('No Gemini API keys available');
      }
      
      const key = this.keys[this.currentIndex];
      this.currentIndex = (this.currentIndex + 1) % this.keys.length;
      return key;
    }
  
    // 处理密钥错误 - 可选的高级功能
    markKeyAsFailedTemporarily(key) {
      const index = this.keys.indexOf(key);
      if (index !== -1) {
        this.keys.splice(index, 1);
        // 5分钟后重新添加该密钥
        setTimeout(() => {
          this.keys.push(key);
        }, 5 * 60 * 1000);
      }
    }
  }
  
  // 单例模式
  const keyManager = new KeyManager();
  export default keyManager;