# GitHub Pages 部署配置说明

## 问题诊断
当前错误：`Error: Failed to create deployment (status: 404)`

**原因**：GitHub Pages 源配置不正确或未启用

## ✅ 正确配置步骤

### 1. 访问 Pages 设置
访问您的仓库设置页面：
```
https://github.com/Xujinhuana/openeducation/settings/pages
```

### 2. 配置部署源

在 **Build and deployment** 部分：

#### 选项 A：如果看到 Source 下拉菜单
1. 点击 **Source** 下拉菜单
2. 选择 **GitHub Actions**
3. 点击 **Save**

```
Source: GitHub Actions ✓
```

#### 选项 B：如果看到 "Get started with GitHub Pages"
1. 如果页面提示 "GitHub Pages is currently disabled"
2. 点击页面上的任何 "Enable" 或 "Get started" 按钮
3. 然后选择 **GitHub Actions** 作为源

### 3. 检查 Actions 权限

同时确保 GitHub Actions 有正确的权限：

1. 访问：`https://github.com/Xujinhuana/openeducation/settings/actions`
2. 找到 **Workflow permissions** 部分
3. 选择 **Read and write permissions** ✓
4. 勾选 **Allow GitHub Actions to create and approve pull requests** ✓
5. 点击 **Save**

### 4. 重新运行部署

完成上述配置后：
1. 返回 Actions 页面
2. 点击失败的 workflow
3. 点击右上角 **Re-run all jobs**

## 预期结果

配置正确后，您应该看到：
- ✅ build job - 成功
- ✅ deploy job - 成功
- 🌐 网站地址：`https://xujinhuana.github.io/openeducation/`

## 常见问题

### Q: 为什么必须选择 "GitHub Actions"？
A: 因为您的 workflow 文件使用的是 `actions/deploy-pages@v2`，这需要 Pages 配置为从 Actions 部署。

### Q: 我的仓库是私有的，能用 GitHub Pages 吗？
A: 可以，但需要 GitHub Pro、Team 或 Enterprise 账户。

### Q: 还是失败怎么办？
A: 检查：
1. 仓库名称是否正确
2. 分支名称是否为 `main`（不是 `master`）
3. Actions 是否被禁用

## 配置完成标志

当配置成功后，在 Pages 设置页面您会看到：
```
Your site is live at https://xujinhuana.github.io/openeducation/
```

