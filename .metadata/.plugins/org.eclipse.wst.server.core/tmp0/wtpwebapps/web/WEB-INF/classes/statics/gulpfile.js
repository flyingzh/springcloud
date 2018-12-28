var gulp = require('gulp'),
	//jshint = require('gulp-jshint'),//js代码校验
	concat = require('gulp-concat'),//合并js代码
	uglify = require('gulp-uglify'),//压缩js代码
	rename = require('gulp-rename');
	//imagemin = require('gulp-imagemin');//压缩图片
var concatCss = require('gulp-concat-css');
var cssnano = require('gulp-cssnano');
var modifyCssUrls = require('gulp-modify-css-urls');
var babel = require('gulp-babel');
	
/*
	<script src='${rc.contextPath}/js/jquery-2.0.3.min.js?_=${sourceKey}'></script>
	<script src='${rc.contextPath}/js/vue.min.js?_=${sourceKey}'></script>
	<script src="${rc.contextPath}/plugins/layui/layui.all.js?_=${sourceKey}"></script>
	<script src='${rc.contextPath}/plugins/jqgrid/jquery.jqGrid.min.js?_=${sourceKey}'></script>
	<script src='${rc.contextPath}/plugins/jqgrid/grid.locale-cn.js?_=${sourceKey}'></script>
	<script src='${rc.contextPath}/plugins/jquery-validation-1.17/jquery.validate.min.js?_=${sourceKey}'></script>
	<script src="${rc.contextPath}/plugins/jquery-validation-1.17/additional-methods.min.js?_=${sourceKey}"></script>
	<script src='${rc.contextPath}/plugins/jquery-validation-1.17/messages_zh.js?_=${sourceKey}'></script>
	<script src='${rc.contextPath}/plugins/ztree/jquery.ztree.all.min.js?_=${sourceKey}'></script>
	<script src="${rc.contextPath}/plugins/iview/iview.min.js?_=${sourceKey}"></script>
	<script src="${rc.contextPath}/js/basedata/accounting.min.js?_=${sourceKey}"></script>
	
<script src='${rc.contextPath}/js/common.js?_=${sourceKey}'></script>
<script src='${rc.contextPath}/ktc/js/app.js?_=${sourceKey}'></script>	
<script src="${rc.contextPath}/js/utils.js?_=${sourceKey}"></script>
<script type="text/javascript" src="${rc.contextPath}/js/http.js?_=${sourceKey}"></script>
*/
	
gulp.task('js', function() {
    //return gulp.src('./js/*.js')
    return gulp.src([
			'./js/vue.min.js',
			'./plugins/iview/iview.min.js',
			'./js/jquery-2.0.3.min.js',
			'./plugins/jqgrid/jquery.jqGrid.min.js',
			'./plugins/jqgrid/grid.locale-cn.js',
			'./plugins/jquery-validation-1.17/jquery.validate.min.js',
			'./plugins/jquery-validation-1.17/additional-methods.min.js',
			'./plugins/jquery-validation-1.17/messages_zh.js',
			'./plugins/ztree/jquery.ztree.all.min.js',
			//'./plugins/layui/layui.all.js',
			'./js/basedata/accounting.min.js'
		])
        .pipe(concat('vendors.js'))    //合并所有js到vendors.js
        .pipe(gulp.dest('./dist/js'))    //输出main.js到文件夹
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('./dist/js'));  //输出
});
	
/*
	<link rel="stylesheet" href="${rc.contextPath}/plugins/layui/css/layui.css?_=${sourceKey}">
	<link rel="stylesheet" href="${rc.contextPath}/plugins/jqgrid/ui.jqgrid-bootstrap.css?_=${sourceKey}">
	<link rel="stylesheet" href="${rc.contextPath}/plugins/ztree/css/metroStyle/metroStyle.css?_=${sourceKey}">
	<link rel="stylesheet" href="${rc.contextPath}/plugins/ztree/css/zTreeStyle/zTreeStyle.css?_=${sourceKey}">
	<link rel="stylesheet" href="${rc.contextPath}/css/bootstrap.min.css?_=${sourceKey}">
	<link rel="stylesheet" href="${rc.contextPath}/css/font-awesome.min.css?_=${sourceKey}">
	<link rel="stylesheet" href="${rc.contextPath}/css/iview.css?_=${sourceKey}">
<link rel="stylesheet" href="${rc.contextPath}/css/main.css?_=${sourceKey}">
<link rel="stylesheet" href="${rc.contextPath}/ktc/css/common.css?_=${sourceKey}">
<link rel="stylesheet" href="${rc.contextPath}/ktc/css/print.css?_=${sourceKey}" media="print">
*/
gulp.task('css', function() {
    return gulp.src([
			'./blank.css',
			'./plugins/layui/css/layui.css',
			'./plugins/jqgrid/ui.jqgrid-bootstrap.css',
			'./plugins/ztree/css/metroStyle/metroStyle.css',
			'./plugins/ztree/css/zTreeStyle/zTreeStyle.css',
			'./css/bootstrap.min.css',
			'./css/font-awesome.min.css',
			'./css/iview.css'
		])
        .pipe(concatCss('vendors.css'))
		.pipe(gulp.dest('./dist/css'))		
		.pipe(modifyCssUrls({
			/*
			modify: function (url, filePath) {           
				if (url.indexOf('fontawesome-webfont') != -1) {
					return url.substring(3)           
				}
			}
			*/
			prepend: '/web/'
			//append: '"'
		}))
		.pipe(cssnano())        
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('prod', function() {
	return gulp.src('./js/**/*.js')
	.pipe(babel({
	  presets: ['env', 'stage-3']
	}))
	.pipe(uglify())
	.pipe(gulp.dest('./dist/js'));
});