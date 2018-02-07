<template>
  <ul class="sidebar-menu">
    <li class="header">Manage</li>
    <router-link tag="li" class="pageLink" to="/user">
      <a>
        <i class="fa fa-users"></i>
        <span class="page">用户管理</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/team">
      <a>
        <i class="fa fa-table"></i>
        <span class="page">团队管理</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/tag">
      <a>
        <i class="fa fa-tags"></i>
        <span class="page">标签管理</span>
      </a>
    </router-link>

    <li class="header">Files</li>
    <router-link tag="li" class="pageLink" to="/file">
      <a>
        <i class="fa fa-folder-o"></i>
        <span class="page">文件管理</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/search">
      <a>
        <i class="fa fa-search"></i>
        <span class="page">文件搜索</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/access">
      <a>
        <i class="fa fa-calendar-o"></i>
        <span class="page">任务进度</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/repos">
      <a>
        <i class="fa fa-list-ul"></i>
        <span class="page">待办事件</span>
      </a>
    </router-link>

    <li class="header">PAGES</li>
    <router-link tag="li" class="pageLink" to="/login">
      <a>
        <i class="fa fa-circle-o text-yellow"></i>
        <span class="page"> Login</span>
      </a>
    </router-link>
    <router-link tag="li" class="pageLink" to="/404">
      <a>
        <i class="fa fa-circle-o text-red"></i>
        <span class="page"> 404</span>
      </a>
    </router-link>
  </ul>
</template>
<script>
export default {
  name: 'SidebarName'
}
</script>
<style>
  /* override default */
  .sidebar-menu>li>a {
    padding: 12px 15px 12px 15px;
  }

  .sidebar-menu li.active>a>.fa-angle-left, .sidebar-menu li.active>a>.pull-right-container>.fa-angle-left {
    animation-name: rotate;
    animation-duration: .2s;
    animation-fill-mode: forwards;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(-90deg);
    }
  }
</style>
