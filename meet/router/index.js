/**
 * 路由注册表
 */
import routes from '@/router/router'; // 路由地址
import interceptors from './interceptors'; // 路由拦截器

const router = new VueRouter({
  routes
});
const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

router.beforeEach(interceptors);

export default router;
