<template>
  <div>
    <template v-for="(item, index) in menuList.leftMenus">
      <div style="text-align: center;" :key="index">
        <!--没有子菜单-->
        <div v-if="item.subMenus.length === 0">
          <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text"
                  @click.native="_goto(item.uri);_acitveMenu(item.name,'');_changeMenu(item.name,'',menuList,item.uri)">
            <Icon :size="20" :color="iconColor" :type="item.icon"></Icon>
          </Button>
        </div>
        <!--有子菜单-->
        <div v-else>
          <Dropdown transfer placement="right-start" :key="index">
            <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
              <Icon :size="20" :color="iconColor" :type="item.icon"></Icon>
            </Button>
            <DropdownMenu style="width: 200px;" slot="list">
              <template v-for="(child, i) in item.subMenus">
                <DropdownItem :name="child.name" :key="i"
                              @click.native="_goto(child.uri);_acitveMenu(item.name,child.name);_changeMenu(item.name,child,menuList,'')">
                  <Icon :type="child.icon"></Icon>
                  <span style="padding-left:10px;">{{ child.name }}</span></DropdownItem>
              </template>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import Store from 'store2';

  export default {
    name: 'sidebarMenuShrink',
    props: {
      menuList: {
        type: Array
      },
      iconColor: {
        type: String,
        default: 'white'
      },
      menuTheme: {
        type: String,
        default: 'darck'
      }
    },
    methods: {
      _goto(next) {
        this.$router.push(next)
      },
      _acitveMenu(openName, activeName) {
        let activeMenus = {};
        if(activeName === ''){
          activeMenus = {openName: openName};
        }else{
          activeMenus = {openName: openName, activeName: activeName};
        }
        localStorage.setItem("activeMenus", JSON.stringify(activeMenus));//用localStorage保存转化好的的字符串
      },
      _changeMenu(name, child, item,uri) {
        if(child === ''){
          this.$emit("on-change", {openName:name,name:name,uri:uri});
          Store.session('crumbsArray', [item.name, name]);
        }else{
          child.openName = name;
          this.$emit("on-change", child);
          //存储 面包屑数组
          let data = [item.name, name, child.name];
          Store.session('crumbsArray', data);
        }
      },
    }
  };
</script>
