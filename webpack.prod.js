const webpack = require('webpack');
const path = require('path');

/*
 * We've enabled UglifyJSPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/uglifyjs-webpack-plugin
 *
 */

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

/*
 * We've enabled ExtractTextPlugin for you. This allows your app to
 * use css modules that will be moved into a separate CSS file instead of inside
 * one of your module entries!
 *
 * https://github.com/webpack-contrib/extract-text-webpack-plugin
 *
 */

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');
module.exports = {
	mode: 'production',
	entry: {
		common: './compile'
	},

	output: {
		filename: './js/ui.min.js', // JS Bundle 파일 경로 및 파일 명
		path: path.resolve(__dirname, 'html/inc') // 경로 설정
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options: {
					presets: ['env']
				}
			},
			{
				test: /\.(scss|css)$/,
				use: ExtractTextPlugin.extract({
					use: [
						{
							loader: 'css-loader',
							options: {
								sourceMap: true,
								minimize: true,
								url: false
							}
						},
						{
							loader: 'sass-loader',
							options: {
								sourceMap: true
							}
						}
					],
					fallback: 'style-loader'
				})
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
				exclude: /node_modules/,
				loader: 'file-loader',
            	options: {
					name: '[name].[ext]',
					context: '',
					emitFile: false
				}
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							emitFile: false
						}
					}
				]
			},
			{
				test: /\.png$/, 
				loaders: [
					'file-loader?name=i/[hash].[ext]'
				]
			},
		]
	},

	resolve: {
        modules: ["node_modules", "spritesmith-generated"]
    },

	plugins: [
		new UglifyJSPlugin(), 
		new ExtractTextPlugin('css/[name].min.css'), // CSS Bundle 파일 경로 및 파일 명
		// new SpritesmithPlugin({ // Images Sprite 관련 셋팅
		// 	src: {
		// 		cwd: path.resolve(__dirname, 'html/inc/images'), // Image 폴더 설정
		// 		glob: '*.png'
		// 	},
		// 	target: {
		// 		image: path.resolve(__dirname, 'html/inc/sprite/sprite.png'), // Sprite된 Image 폴더 설정 및 파일 명
		// 		css: path.resolve(__dirname, 'html/inc/sprite/sprite.css') // Sprite된 CSS 폴더 설정 및 파일 명
		// 	},
		// 	apiOptions: {
		// 		cssImageRef: "~sprite.png"
		// 	}
		// })
	]
};
