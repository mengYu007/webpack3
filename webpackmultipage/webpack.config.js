var path = require('path');
var webpack = require('webpack');
var htmlWebpackPlugin = require('html-webpack-plugin');
var cleanWebpackPlugin = require('clean-webpack-plugin');
var uglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
	entry:{ //入口
		app:'./src/app.js',
		/*flexible:'flexible.js',
		zepto:'zepto.min.js'*/
		common:[
			'./src/flexible.js'/*,
			'./src/zepto.min.js'*/
		]
	},
	output:{//出口
		path:path.resolve(__dirname,'build'),
		publicPath: '',//cdn
		filename:'js/[name]._[hash].js'
	},
	devServer:{ //服务
		contentBase:'./build',
		//host:'localhost',
		//hot: true,
		open:true,
		inline:true,
		progress: true,//显示打包速度
		port:8080,
		proxy:{//代理
			"/v2":{//请求v2下的接口都会被代理到 target： http://xxx.xxx.com 中
				target:'https://api.douban.com',
				changeOrigin: true,
				secure: false,// 接受 运行在 https 上的服务
				pathRewrite:{'^/v2':''}


			}
		}
	},
	module:{
		rules:[
			{//css loader
				test:/\.css$/,
				use:ExtractTextPlugin.extract({
					fallback:'style-loader',
					use:['css-loader']
				})
			},
			{//js loader
				test:/\.js$/,
				exclude: /(node_modules|bower_components)/,
				use:{
					loader:'babel-loader'
				}
			},
			{// img 压缩，，生成hash值
				test: /\.(png|svg|jpg|gif)$/,
				use: "file-loader?name=[name][hash].[ext]&publicPath=../img/&outputPath=./img"
				/*name=[name].[ext]文件名，publicPath=../css中路径，outputPath=./img打包后的生成地址*/
			},
			{
				 test: /\.(woff|woff2|eot|ttf|otf)$/,
				 use:['file-loader']
			},
			{ //引用jquery
				 test: require.resolve('jquery'),
		          use: [{
		              loader: 'expose-loader',
		              options: 'jQuery'
		          },{
		              loader: 'expose-loader',
		              options: '$'
		          }]
	        }
		]
	},
	devtool:'inline-source-map',
	plugins:[
		new htmlWebpackPlugin({ //有几个生成new几个html,生成html
			filename:'index.html',
			titile:'apphtml',
			template:'index.html',
			chunks:['app'],//html需要引入的js
			cache:true,//只有在内容变化时才会生成新的html
			minify:{
                removeComments:true, //是否压缩时 去除注释
                collapseWhitespace: false
            }
		}),
		new htmlWebpackPlugin({
			filename:'index2.html',
			titile:'apphtml',
			template:'index2.html',
			chunks:['app'],//html需要引入的js
			cache:true,//只有在内容变化时才会生成新的html
			minify:{
                removeComments:true, //是否压缩时 去除注释
                collapseWhitespace: false
            }
		}),
		new htmlWebpackPlugin({
			filename:'about._[hash].html',
			titile:'apphtml',
			template:'about.html',
			//hash:true,
			chunks:['app'],//html需要引入的js
			cache:true,//只有在内容变化时才会生成新的html
			"head": {
		        "entry": "./build",
		        "css": [ "css/about.css" ]
		     },
			minify:{
                removeComments:true, //是否压缩时 去除注释
                collapseWhitespace: false
            }
		}),
		new cleanWebpackPlugin(['build']),
		/*new webpack.ProvidePlugin({
		    $: "jquery",
		    jQuery: "jquery",
		    "window.jQuery": "jquery"
		}),*/

		new uglifyjsWebpackPlugin(),
		new ExtractTextPlugin({ //提取css
			filename:'css/[name]._[hash].css',
			disable:false,

			allChunks:true
		}),
		new webpack.optimize.CommonsChunkPlugin({ //打包公共js
			//name:['flexible','zepto'],
			name:'common',
			chunks:['./src'],
			minChunks:2,
			minChunks: Infinity
		}),
		new webpack.HashedModuleIdsPlugin(),
		new OpenBrowserPlugin({ url: 'http://localhost:8080' }) //自动打开浏览器
	]
	/*externals:{
		$: "jquery",
		jQuery: "jquery",
		"window.jQuery": "jquery"
	}*/
};