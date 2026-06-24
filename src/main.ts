import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from '@/App.vue';
import './index.css';
import '@/assets/scss/main.scss';
import 'ant-design-vue/dist/reset.css';

const app = createApp(App);

app.use(Antd);

app.mount('#app');
