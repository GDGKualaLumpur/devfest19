const fetch = require('node-fetch');
const fs = require('fs');
const builder = require('xmlbuilder');

const siteTitle = 'DevFest 2019 Kuala Lumpur';

let prerenderJson = [
	{
		url: '/',
		title: siteTitle
	},
	{
		url: '/attending',
		title: 'Attending - '+siteTitle
	},
	{
		url: '/registration',
		title: 'Registration - '+siteTitle
	},
	{
		url: '/faq',
		title: 'FAQ - '+siteTitle
	},
	// {
	// 	url: '/faq/communityguidelines',
	// 	title: 'Community Guidelines - DevFest 2019 Kuala Lumpur'
	// },
	{
		url: '/speakers',
		title: 'Speakers - '+siteTitle
	},
	{
		url: '/map',
		title: 'Event Map - '+siteTitle
	},
	{
		url: '/schedule',
		title: 'Schedule - '+siteTitle
	},
	{
		url: '/checkin',
		title: 'Schedule - '+siteTitle
	},
	{
		url: '/sponsor',
		title: 'Sponsor - '+siteTitle
	},
	{
		url: '/redeem',
		title: 'Redeem - '+siteTitle
	}
];

const base = 'https://devfest.gdgkl.dev';
const getSpeakers = new Promise((resolve) => {
	// fetch(`${dbUrl}/speakers.json`)
	// 	.then((response) => {
	// 		response.json().then((data) => {
	// 			let speakers = [];
	// 			speakers = Object.keys(data).map(item => ({
	// 				url: `/speakers/${item}`,
	// 				title: `${data[item].name} - Speakers - DevFest 2019 Kuala Lumpur`
	// 			}));
	// 			resolve(speakers);
	// 		});
	// 	});
	resolve([]);
});

const getSessions = new Promise((resolve) => {
	// fetch(`${dbUrl}/sessions.json`)
	// 	.then((response) => {
	// 		response.json().then((data) => {
	// 			let sessions = [];
	// 			sessions = Object.keys(data).map(item => ({
	// 				url: `/schedule/${item}`,
	// 				title: `${data[item].title} - Schedule - DevFest 2019 Kuala Lumpur`
	// 			}));
	// 			resolve(sessions);
	// 		});
	// 	});
	resolve([]);
});

Promise.all([getSpeakers, getSessions]).then((values) => {
	const data = [...prerenderJson, ...values[0], ...values[1]];
	fs.writeFile('src/prerender-urls.json', JSON.stringify(data, null, 4), () => {});
	const lastMod = new Date().toISOString();
	let xml = builder.create('urlset', { version: '1.0', encoding: 'UTF-8' });
	data.forEach(item => {
		xml.ele('url')
			.ele('loc')
			.txt(`${base}${item.url}`)
			.up()
			.ele('lastmod')
			.text(lastMod)
			.up();
	});
	xml.end({ pretty: true });
	fs.writeFile('src/sitemap.xml', xml.doc().toString({ pretty: true }), () => {});
	// eslint-disable-next-line no-console
	console.log('\x1b[32m%s\x1b[0m', `Pre-render config generated successfully: ${data.length} routes generated.`);
});
