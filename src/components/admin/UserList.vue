<template>
    <div>
        <h3>用户列表</h3>
        <el-breadcrumb separator-class="el-el-icon-arrow-right">
            <el-breadcrumb-item :to="{path:'/home'}">首页></el-breadcrumb-item>
            <el-breadcrumb-item>权限管理></el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 用户列表主体部分 -->
        <el-card>
            <el-row :gutter="25">               
                <el-col :span="10">
                    <!-- 搜索区域 -->
                    <el-input placeholder="请输入搜索内容" v-model=" queryInfo.query" clearable @clear="getUsetList">
                        <el-button slot="append" icon="el-icon-search" @click="getUsetList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="1">
                    <!-- 搜索按钮 -->
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>  
              <!--  用户列表-->
              <el-table :data="userList" border stripe>
                  <!-- 索引列 -->
                  <el-table-column type="index"></el-table-column>
                  <el-table-column label="用户名" prop="username"></el-table-column>
                  <el-table-column label="邮箱" prop="email"></el-table-column>
                  <el-table-column label="密码" prop="password"></el-table-column>
                  <el-table-column label="角色" prop="role"></el-table-column>
                  <el-table-column label="状态" prop="state">
                      <template slot-scope="scope">
                          <el-switch v-model="scope.row.state" @change="userStatechanged(scope.row)"></el-switch>  
                      </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="修改" placement="top-start" :enterable="false" >
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top-start" :enterable="false" > 
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="分配权限" placement="top-start" :enterable="false" >
                            <el-button type="warning" icon="el-icon-setting" size="mini" ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页组件 size-change 每页最大变化  current-change当前最大变化 layout功能组件-->
            <div>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pageNum"
                    :page-sizes="[1, 2, 5, 10,15,100]"
                    :page-size="queryInfo.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>

        </el-card>
        <!-- 添加用户对话框 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="addUser">确定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog title="修改用户信息" :visible.sync=" editDialogVisidle" width="50%" @close="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <!-- disabled 无法编辑 -->
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="editForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="editUserInfo">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    created() {
        this.getUsetList();
        
    },
    data() {
        return {
            // 查询信息实体
            queryInfo:{    
                query:"",  //查询信息
                pageNum:1, //当前页
                pageSize:15,  //每页最大数
            },
            userList:[],   //用户列表
            total:0,  //总记录数

            addDialogVisible:false, //对话框状态
            addForm:{
                username:'',
                password:'',
                email:'',
            },
            //修改用户信息
            editForm:{},
            //显示/隐藏修改用户栏
            editDialogVisidle:false,


            //添加表单验证
             addFormRules: {
                username:[
                    {required : true, message : '请输入用户名' , trigger : 'blur'},//必填校验
                    {min:5,max:12,message:'长度在5~12个字符',trigger:'blur'} //长度校验
                ],
                password:[
                    {required:true,message:'请输入密码',trigger:'blur'},//必填校验
                    {min:6,max:10,message:'长度在6~10个字符',trigger:'blur'} //长度校验
                ],
                email:[
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ],
            },
            //修改表单验证
            editFormRules: {
                password:[
                    {required:true,message:'请输入密码',trigger:'blur'},//必填校验
                    {min:6,max:10,message:'长度在6~10个字符',trigger:'blur'} //长度校验
                ],
                email:[
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ],
            },
        }
    },
    methods: {
        // 获取所有用户
        async getUsetList(){
            const {data:res} = await this.$http.get("alluser",{params:this.queryInfo});
            console.log(res.data);
            console.log(res.numbers);
            this.userList = res.data;      //用户列表数据封装
            this.total = res.numbers;   //总用户数封装
        },
        // 最大数
        handleSizeChange(newSize){
            this.queryInfo.pageSize = newSize;
            this.getUsetList();
        },
        // pageNum的触发事件
        handleCurrentChange(nwePage){
            this.queryInfo.pageNum = nwePage;
            this.getUsetList();
        },

        //修改用户状态
        async userStatechanged(userInfo){
           const {data:res} = await this.$http.put(`userstate?id=${userInfo.id}&state=${userInfo.state}`);
           if(res!="success"){
               userInfo.id = !userInfo.id;
               return this.$message.error("操作失败！！！");
           }
           this.$message.success("操作成功！！！")
        },
        //监听添加用户操作
        addDialogClosed(){
            this.$refs.addFormRef.resetFields();  //清零
        },
        addUser(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid) return;  //验证true 或false
                const {data:res} = await this.$http.post("addUser",this.addForm);     //提交数据并反馈提交结果
                if(res!="success"){    //数据反馈
                    return this.$message.error("操作失败！！！");
                }
                this.$message.success("操作成功！！！")
                this.addDialogVisible = false;    //关闭添加框
                this.getUsetList(); //页面刷新
            });
        },
        //根据主键删除用户
        async deleteUser(id){
            const confirmResult = await this.$confirm('此操作将永久删除用户，是否继续？','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'warning',     //感叹号
            }).catch(error =>error)
            if(confirmResult !='confirm'){
                return this.$message.info("已取消删除");
            }
            const {data:res} = await this.$http.delete("deleteUser?id="+id);
            if(res != "success"){    //数据反馈
                return this.$message.error("删除失败！！！");
            }
            this.$message.success("操作成功！！！")
            this.getUsetList();   //页面刷新
        },
        //显示对话框
        async showEditDialog(id){
            const {data:res} = await this.$http.get("getUpdate?id="+id);
            this.editForm = res;       //查询出用户信息反填回编辑表单
            this.editDialogVisidle = true;    //开启编辑对话框
        },
        //关闭窗口
        editDialogClosed(){
            this.$refs.addFormRef.resetFields();//重置信息
        },
        //确认修改
        editUserInfo(){
            this.$refs.editFormRef.validate(async valid=>{
            if(!valid) return;  //验证true 或false
            const {data:res} = await this.$http.post("editUser",this.editForm);     //提交数据并反馈提交结果
            if(res!="success"){    //数据反馈
                return this.$message.error("操作失败！！！");
            }
            this.$message.success("操作成功！！！")
            this.editDialogVisidle = false;    //关闭添加框
            this.getUsetList(); //页面刷新
        });

        }
    },  
}
</script>
<style lang="less" scoped>
    .el-breadcrumb{
        margin-bottom: 15px;
        font-size: 17px;
    }   
</style>