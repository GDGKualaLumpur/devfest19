import preactCliSwPrecachePlugin from 'preact-cli-sw-precache';
import CopyWebpackPlugin from 'copy-webpack-plugin';

export default (config, env, helpers) => {
	config.output.publicPath =  '/';

	if (env.isProd) {
    config.devtool = false; // disable sourcemaps
	}
	
	config.plugins.push(
		new helpers.webpack.DefinePlugin({
			'process.env.PUBLIC_PATH': JSON.stringify(config.output.publicPath || '/')
		}),
		new CopyWebpackPlugin([
			{ from: `${__dirname}/src/robots.txt` },
			{ from: `${__dirname}/src/sitemap.xml` }
		])
	);

	const precacheConfig = {
		filename: 'sw.js',
		navigateFallback: 'index.html',
		navigateFallbackWhitelist: [/^(?!\/__).*/],
		minify: true,
		stripPrefix: config.cwd,
		staticFileGlobsIgnorePatterns: [
			/polyfills(\..*)?\.js$/,
			/\.map$/,
			/push-manifest\.json$/,
			/.DS_Store/,
			/\.git/
		],
		runtimeCaching: [
			{
				urlPattern: /^https:\/\/res\.cloudinary\.com\//,
				handler: 'cacheFirst',
				options: {
					cache: {
						maxEntries: 200,
						name: 'items-cache'
					}
				}
			}
		]
	};
	
	//netlifyPlugin(config);

	return preactCliSwPrecachePlugin(config, precacheConfig);
};