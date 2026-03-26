import { createApp } from 'vue';
import { pinia } from '@/store';
import Antd from 'ant-design-vue';
import App from '@/App.vue';
import router from '@/router';
import '@/assets/styles/main.css';
import 'ant-design-vue/dist/reset.css';

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(Antd);

app.mount('#app');
