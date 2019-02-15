<style lang="less">
    @import './styles/menu.less';
</style>

<template>
    <div :style="{background: bgColor}" class="ivu-shrinkable-menu">
        <slot name="top"></slot>
        <sidebar-menu
            v-show="!shrink"
            :menu-theme="theme"
            :menu-list="menuList"
            :active-name="activeName"
            :open-names="openNames"
            @on-change="handleChange"
        ></sidebar-menu>
      <!--收缩时的菜单 menu-->
        <sidebar-menu-shrink
            v-show="shrink"
            :menu-theme="theme"
            :menu-list="menuList"
            :icon-color="shrinkIconColor"
            @on-change="handleChange"
        ></sidebar-menu-shrink>
      <!--收缩时的菜单 /menu-->
    </div>
</template>

<script>
import sidebarMenu from './components/sidebarMenu.vue';
import sidebarMenuShrink from './components/sidebarMenuShrink.vue';

export default {
    name: 'shrinkableMenu',
    components: {
        sidebarMenu,
        sidebarMenuShrink
    },
    props: {
        shrink: {
            type: Boolean,
            default: false
        },
      menuList: {
            type: Array,
            required: true
        },
        theme: {
            type: String,
            default: 'dark',
        },
        openNames: {
            type: Array
        },
      activeName:''
    },
    computed: {
        bgColor () {
            return this.theme === 'dark' ? '#495060' : '#fff';
        },
        shrinkIconColor () {
            return this.theme === 'dark' ? '#fff' : '#495060';
        }
    },
    methods: {
        handleChange (name) {
            this.$emit('on-change', name);
        }
    }
};
</script>
