<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡牌视图 -->
    <el-card>
      <!-- 添加商品分类 -->
      <el-row :gutter="20">
        <el-col :span="10"
          ><el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="5">
          <el-button type="primary" @click="goAddGoodPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品展示 -->
      <el-table :data="goodsList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格"
          prop="goods_price"
          width="70px"
        ></el-table-column>
        <el-table-column
          label="商品数量"
          prop="goods_number"
          width="60px"
        ></el-table-column>
        <el-table-column label="添加时间" width="100px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditGoodsDialog(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-delete"
              size="mini"
              @click="delGoodsDialog(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
    <!-- 编辑商品对话框 -->
    <el-dialog
      title="编辑商品信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model.number="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model.number="editForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model.number="editForm.goods_number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      editDialogVisible: false,
      editForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
      },
      editFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
          { type: "number", message: "必须为数字值", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
          { type: "number", message: "必须为数字值", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
          { type: "number", message: "必须为数字值", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败");
      }
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      this.$message.success("获取商品列表成功");
      console.log(this.goodsList);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.queryInfo.pagesize = val;
      this.getGoodsList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.queryInfo.pagenum = val;
      this.getGoodsList();
    },
    goAddGoodPage() {
      this.$router.push("/goods/add");
    },
    async showEditGoodsDialog(id) {
      const { data: res } = await this.$http.get(`goods/${id}`);
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message, error("获取商品信息失败!");
      }
      this.editForm = res.data;
      console.log(this.editForm);
      this.editDialogVisible = true;
    },
    editGoods() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `goods/${this.editForm.goods_id}`,
          // {
          //   goods_name: this.editForm.goods_name,
          //   goods_price: this.editForm.goods_price,
          //   goods_weight: this.editForm.goods_weight,
          //   goods_number: this.editForm.goods_number,
          // }
          this.editForm
        );
        console.log(res)
        if(res.meta.status !== 200){
          return this.$message.error('更新商品信息失败!')
        }
        this.$message.success('更新商品信息成功!')
        this.getGoodsList()
        this.editDialogVisible = false
      });
    },
    async delGoodsDialog(row) {
      const confirmRes = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((error) => error);
      console.log(confirmRes);
      if (confirmRes !== "confirm") {
        return this.$message.error("已取消删除!");
      }
      const { data: res } = await this.$http.delete(`goods/${row.goods_id}`);
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("删除商品失败!");
      }
      this.$message.success("删除商品成功!");
      this.getGoodsList();
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
  },
};
</script>

<style lang="less" scoped></style>
