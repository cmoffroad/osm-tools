function write (content) {
  document.querySelector('.content').innerHTML = content;
}

function process () {
  const search = decodeURIComponent(window.location.hash.substring(1) || 'cmoffroad');

  write(`searching for user '${search}'`);

  const args = search.match(/^[0-9]+$/) ? `user=${search}` : `display_name=${search}`

  fetch(`https://api.openstreetmap.org/api/0.6/changesets.json?${args}`)
  .then(response => response.json())
  .then(data => {
    const { changesets } = data;
    if (changesets.length === 0)
      write(`no OSM user under name or id '${search}'`)
    else {
      const id = changesets[0].uid;
      const names = changesets.map(c => c.user).filter((v, i, a) => a.indexOf(v) === i);
      writeUserSection({ id, names, changesets });
    }
  })
  .catch(function (err) {
    write(err.message);
  });
}

function writeUserSection(user) {
  const { id, names, changesets } = user;
  const name = names[0];
  const otherNames = names.slice(1);  

  const links = {
    'Whos that': `http://whosthat.osmz.ru/?q=${id}`,
    'API /user': `https://api.openstreetmap.org/api/0.6/user/${id}.json`,
    'API /changesets': `https://api.openstreetmap.org/api/0.6/changesets.json?user=${id}`,
    'OSM profile': `https://www.openstreetmap.org/user/${name}`,
    'MISSING MAPS profile': `https://www.missingmaps.org/users/#/${name}`,
    'NEIS profile': `https://hdyc.neis-one.org/?${name}`,
    'NEIS heatmap': `https://yosmhm.neis-one.org/?${name}`,
    'NEIS changesets comments': `https://resultmaps.neis-one.org/osm-discussion-comments?uid=${user.id}&commented`,
    'OSMCHA changesets': `https://osmcha.org/?filters={"users":[{"label":"${name}","value":"${name}"}],"date__gte":[{"label":"","value":""}]}`,
    'OSMCHA changesets [major roads]': `https://osmcha.org/?filters={"date__gte":[{"label":"","value":""}],"users":[{"label":"${name}","value":"${name}"}],"reasons":[{"label":"Edited a major road","value":19}]}`,
  }

  const items = Object.entries(links).map(([label, url]) => {
    return `<li><a href="${encodeURI(url)}" target="_blank">${label}</a></li>`;
  })

  const changesetIds = changesets.map(c => c.id).join('\n');
  write(`
    <h3><a href="#${name}">${name}</a> [<a href="#${id}">${id}</id>]</h3>
    <i>Previously: ${otherNames}</i>
    <ul>${items.join('\n')}</ul>
    <button onclick="Object.values(links).forEach(l => window.open(l))">Open All Links</button>
    <button onclick="navigator.clipboard.writeText(document.querySelector('#changesets').innerHTML)">Copy all changesets</button>
    <!--<pre>${JSON.stringify(user, null, 2)}</pre>-->
    <pre id="changesets">${changesetIds}</pre>
  `);
}


process();

window.onhashchange = process;