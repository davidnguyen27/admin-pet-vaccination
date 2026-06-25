import { createApp } from 'vue';
import App from '@/App.vue';
import Antd from 'ant-design-vue';
import router from '@/core/router';
import '../index.css';
import '@/assets/scss/main.scss';
import 'ant-design-vue/dist/reset.css';
import { pinia } from '@/core/plugins/pinia';
import { i18n } from '@/core/plugins/i18n';

const app = createApp(App);

app.use(pinia);
app.use(i18n);
app.use(router);
app.use(Antd);

app.mount('#app');
