const path = require('path');

const isDev = process.env.NODE_ENV === 'development'
const HTMLPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractPlugin = require('extract-text-webpack-plugin');
const config = {
	target: 'web',
  entry: path.join(__dirname, 'src/index.js'),//入口文件
	output:{//输出
	  filename: 'bundle.[hash:8].js',//输出文件名
		path: path.join(__dirname, 'dist')//输出文件路径
	},
	module: {//配置加载资源
	  rules:[//加载规则
		  {
			  test: /.vue$/,
				loader: 'vue-loader'
			},
			{
			  test: /\.jsx$/,
				loader: 'babel-loader'
			},
			{
			  test: /\.(gif|jpg|jpeg|png|svg)$/,
				use:[{
				  loader: 'url-loader',
					options: {
					  limit: 1024,//文件小于1024字节，转换成base64编码，写入文件
						name: '[name].[ext]'
					}
				}]
			}
		]
	},
	plugins:[//webpack插件配置
	  new webpack.DefinePlugin({
		  'process.env':{
			  NODE_ENV: isDev ? '"development"' : '"production"'
			}
		}),
	  new HTMLPlugin({template: './index.html'})
	]
}

if(isDev){//开发环境配置
	config.module.rules.push({
	  test: /\.styl/,
		use: [
		  'style-loader',
			'css-loader',
			{
				loader: 'postcss-loader',
				options: {
				  sourceMap: true
				}
      },
			'stylus-loader'
		]
	});
	config.devtool = '#cheap-module-eval-source-map'
  config.devServer = {
	  port: '8360',
		host: '0.0.0.0',
		overlay:{//webpack编译报错时，直接显示在网页
		  errors: true,
		},
		//historyFallback: {
		//}
		//open: true
		hot: true//不刷新热加载数据
	},
	config.plugins.push(
	  new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin()
	)
} else{//生产环境配置
  config.entry ={//将用到的类库进行单独打包
	  app: path.join(__dirname, 'src/index.js'),
		vendor: ['vue', 'vue-router']
	};
  config.output.filename = '[name].[chunkhash:8].js';
	config.module.rules.push({
	  test: /\.styl/,
		use: ExtractPlugin.extract({
		  fallback: 'style-loader',
			use: [
			  'css-loader',
				{
				  loader: 'postcss-loader',
					options: {
					  sourceMap: true				
					}
				},
				'stylus-loader'
			]
		})
	});
	config.plugins.push(
	  new ExtractPlugin('styles.[contentHash:8].css'),
	);

	config.optimization = {
	  splitChunks: {
		  cacheGroups:{
			  commons: {
				  chunks: 'initial',
					minSize: 0,
					minChunks: 2,
					maxInitialRequests:5,
					name: 'common'
				},
				vendor: {
				  test: /node_modules/,
					chunks: 'initial',
					name: 'vendor',
					priority: 10,
					enforce: true
				}
			}
		},
		runtimeChunk: true
	}
}


module.exports = config;
