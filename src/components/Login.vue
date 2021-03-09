
<template>
    <div class="login_container">
        <!-- 登录块 -->
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 表单区域 -->
            <!-- 从 https://www.iconfont.cn/ 获取 prefix-icon="iconfont icon-denglu" 实现-->
            <el-form ref="loginFormRef" :rules="loginRules" :model="loginForm" class="login_form" label-width="0px">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-denglu" placeholder="用户名"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="iconfont icon-mima" type="password" placeholder="密码"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login()">登录</el-button>
                    <el-button type="info" @click="resetLoginForm()">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            //表单数据对象
            loginForm:{
                username:"admin",
                password:"123456",
            },
            //验证对象
            loginRules:{
                username:[
                    {required:true,message:'请输入用户名',trigger:'blur'},//必填校验
                    {min:5,max:12,message:'长度在5~12个字符',trigger:'blur'} //长度校验
                ],
                password:[
                    {required:true,message:'请输入密码',trigger:'blur'},//必填校验
                    {min:6,max:10,message:'长度在6~10个字符',trigger:'blur'} //长度校验
                ],
            },
           
        };
    }, 
     methods: {
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields() //实现重置
        },
        login(){
           console.log(1234);
            this.$refs.loginFormRef.validate(async valid =>{
                
                if(!valid) return;
                const {data:res} = await this.$http.post("login",this.loginForm);           //访问后端9000端口的login
                //后端LoginController类返回的 res =>ok
                console.log(res);                 
                if(res.username != undefined){
                    this.$message.success("操作成功！！！！");
                    //利用路由事项页面跳转
                    this.$router.push({path:"/home"});
                    let {id,username,password,email,role,state} = res;  //解构
                    console.log(id,username,password,email,role,state);
                    window.sessionStorage.setItem("User",res);//存储user对象   使用session实现状态保持
                // }else if(){
                //     this.$message.error("操作失败！！！");

                }else{
                    this.$message.error("操作失败！！！");
                }
            })
            
        },
    }, 
}
</script>

<style lang="less">
    
     .login_container{
    // background-color: #2b4b6b;
    background-image: url("../assets/image/download.jpg");
    
    height: 100%;
    }
    .login_box{
        width: 450px;
        height: 300px;
        // background-color: #fff;
        background-color: rgba(255,255,255,0.6);  //透明
        border-radius: 3px;
        position: absolute;
        left: 50%;
        right: 50%;
        transform: translate(-50%,90%);
        .avatar_box{
            width: 130px;
            height: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 2px #ddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%,-50%);
            background-color: #0ee;
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;

            }
        }
    }
    .btns{
        display: flex;
        justify-content: flex-end;
    }
    .login_form{
        position: absolute;
        bottom: 0%;
        width: 100%;
        padding:  15px;
        box-sizing: border-box;
    }
</style>
