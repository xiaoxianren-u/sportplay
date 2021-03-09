<template>
    <!-- 引入布局 container-->
    <el-container class="home-container">
        <!-- 头部 -->
        <el-header>
            <div>
                <img src="../assets/image/yundon.jpg" alt="">
                <span>
                    个人运动平台
                </span>
            </div>
            
            Header
                <el-button type="info" @click="logout">安全退出</el-button>
        </el-header>
        <!-- 主体 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="iscollapse? '64px': '200px'">
                <!-- 导航栏的显示与隐藏 -->
                <div class="toggle-button" @click="toggleColl">|||</div>   
                <!-- 背景颜色、字体颜色、选择后的颜色 -->
                <!-- 当导航栏内容多时可以加 unique-opened ，减少显示内容 少的话可以不加 -->
                 <!-- <el-menu background-color="#545c64" text-color="#fff"  active-text-color="#409eff" unique-opened> -->
                 <el-menu background-color="#545c64" text-color="#fff"  active-text-color="#409eff" 
                 :collapse="iscollapse" :collapse-transition="false" :router="true" :default-active=" activePath">
                 <!-- :router="true" 实现导航栏每个页面的生成跳转 ，根据 it.path来加载新的页面 -->
                <!-- 一级菜单 -->
                <el-submenu :index="item.id+''" v-for="item in menuList" :Key="item.id">
                    <template slot="title">
                        <i :class="iconsObject[item.id]"></i>
                        <span v-text="item.title"></span>
                    </template>
                    <!-- 二级菜单 -->   
                    <el-menu-item :index="it.path"  v-for="it in item.sList" :Key="it.id" @click="saveNavState(it.path)">
                        <template slot="title">
                        <i :class="iconsObject[it.id]"></i>
                        <span v-text="it.title">333</span>
                    </template></el-menu-item>
                    
                </el-submenu>
                
                </el-menu>
            </el-aside>
            <!-- 主体内容< --> 
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>


<script>
export default {
    data() {
        return {
            // 菜单列表
            menuList:[],
            iscollapse:false,  //伸缩
            iconsObject:{   //小图标
                '100':'el-icon-s-custom',
                '200':'iconfont icon-paobu',
                '101':'iconfont icon-denglu',
                '102':'iconfont icon-mima',
                '103':'iconfont icon-paobu',
                '104':'iconfont icon-liwu',
                '201':'iconfont icon-shuben',
                '202':'iconfont icon-huo',
                '203':'iconfont icon-canju-muying',
            },
            activePath:'/welcome',
        }
    },
    // onload事件
    created(){
        // 查询menuList
        this.getMenuList();
        this.activePath = window.sessionStorage.getItem('activePath');    //取出session里的path动态修改activePath
    },

    methods:{
        logout(){
            window.sessionStorage.clear();//清除session 存储的记录
            this.$router.push("/login");//页面跳转
        },
        // 获取导航菜单方法
        async getMenuList(){
            const {data:res} = await this.$http.get("menus");
             
            if(res!=undefined){
                console.log(res);
                this.menuList=res;
            }else{
                console.log("6666ddfg");
            }
            
            
        },
        toggleColl(){
            this.iscollapse= !this.iscollapse;
        },
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath',activePath); //存放在session中
            this.activePath=activePath;

        },
    },
    
}
</script>


<style lang="less" scoped>
//布局器样式
.home-container{
    height: 100%;
}

// 头部样式
.el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;  //左右贴边
    padding-left: 0%; //左边界
    align-items: center;
    color:#fff;
    font-size: 20px;
    div{
        display: flex;
        align-items: center;
        span{
            margin-left: 15px;
        }
    }
    
}
// 侧边样式
.el-aside{
    background-color: #333744;
    .el-menu{
        border-right: none;   //侧边框对齐
    }

}
// 主体样式
.el-main{
    background-color: #eaedf1;
    text-align: center;
    font-size: 20px;
}
img{
   width:55px;
   height: 55px;
}
// ||| 按钮样式
.toggle-button{
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;//显示小手
}
</style>