// vk-api script
const vkApiBlock = document.getElementById('vk-wall');
const comunityUrl = 'https://vk.com/heritageschool'

if (vkApiBlock) {
  vkApiRequest(vkApiBlock, comunityUrl);
}

function vkApiRequest (wrapper, comunityUrl) {
  const getComunityPostsRequest = new XMLHttpRequest();
  const vkAccessToken = 'vk1.a.dcjkE-_mz7240DlOc9P5Fu4gi28LgbbgeCpVcEwPasUzXYb3mLhOibCW69807kg-LhaXSrImlguG3HihhMkPYn6Ih8yyLoq-fJC4DUqAMXkCVRUoCwbYLOSbkskkJc4icsj97hoYalgw_WI0Fgk-oaAbSyFpiwaX4ZZoGO45ADhO3pQF1uRDbpUr4GYMxZyu';
  const vkComunityId = -200807305;
  let comunityPostRequestBody = {
    access_token: vkAccessToken,
    owner_id: vkComunityId,
    count: 10,
    v: 5.131,
  }

  // -- Make request params
  comunityPostRequestBody = Object.keys(comunityPostRequestBody).reduce((string, key, index) => {
    let newString = string;

    if (index !== 0) {
      newString += '&' + key + '=' + comunityPostRequestBody[key];
    } else {
      newString += key + '=' + comunityPostRequestBody[key];
    }

    return newString;
  }, '')

  getComunityPostsRequest.open("POST", 'https://api.vk.com/method/wall.get', true);
  getComunityPostsRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  getComunityPostsRequest.send(comunityPostRequestBody);

  getComunityPostsRequest.onload = function () {

    if (getComunityPostsRequest.status != 200) {
      vkApiBlock.remove();
    } else {
      renderVkWrapperItems(vkApiBlock, JSON.parse(getComunityPostsRequest.responseText), comunityUrl);
    }

  }
}

function renderVkWrapperItems (wrapper, data, comunityUrl) {
  const items = data.response.items;
  const minPreviewSize = 500;
  const maxPreviewSize = 900;

  items.forEach(item => {
    const itemData = {
      url: `${comunityUrl}?w=wall${item.from_id}_${item.id}`,
      text: item.text,
      imageUrl: ''
    }

    const photoAttachments = item.attachments && item.attachments.filter((attachment) => attachment.type === 'photo').length ? item.attachments.filter((attachment) => attachment.type === 'photo') : [];
    let previewPhoto = null;

    if (photoAttachments) {
      previewPhoto = photoAttachments[0].photo.sizes.filter((size) =>  size.height <= maxPreviewSize && size.height >= minPreviewSize);

      if (previewPhoto.length) {
        previewPhoto = previewPhoto[0];
      } else {
        previewPhoto = photoAttachments[0].photo.sizes[0];
      }
    }

    if (previewPhoto) {
      itemData.imageUrl = previewPhoto.url;
    }

    renderVkItem(wrapper, itemData);
  });
}

function renderVkItem (wrapper, data) {
  const vkItemTemplate = `
    <a href="${data.url}" class="vk-wall__item">
      <span class="vk-wall__item-inner">
        <span class="vk-wall__item-content">
          <span class="vk-wall__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.579 6.85501C21.719 6.39001 21.579 6.04901 20.917 6.04901H18.724C18.166 6.04901 17.911 6.34401 17.771 6.66801C17.771 6.66801 16.656 9.38701 15.076 11.15C14.566 11.663 14.333 11.825 14.055 11.825C13.916 11.825 13.714 11.663 13.714 11.198V6.85501C13.714 6.29701 13.553 6.04901 13.088 6.04901H9.642C9.294 6.04901 9.084 6.30701 9.084 6.55301C9.084 7.08101 9.874 7.20301 9.955 8.69101V11.919C9.955 12.626 9.828 12.755 9.548 12.755C8.805 12.755 6.997 10.026 5.924 6.90201C5.715 6.29501 5.504 6.05001 4.944 6.05001H2.752C2.125 6.05001 2 6.34501 2 6.66901C2 7.25101 2.743 10.131 5.461 13.94C7.273 16.541 9.824 17.951 12.148 17.951C13.541 17.951 13.713 17.638 13.713 17.098V15.132C13.713 14.506 13.846 14.38 14.287 14.38C14.611 14.38 15.169 14.544 16.47 15.797C17.956 17.283 18.202 17.95 19.037 17.95H21.229C21.855 17.95 22.168 17.637 21.988 17.019C21.791 16.404 21.081 15.509 20.139 14.45C19.627 13.846 18.862 13.196 18.629 12.871C18.304 12.452 18.398 12.267 18.629 11.895C18.63 11.896 21.301 8.13401 21.579 6.85501V6.85501Z" fill="white"/>
            </svg>
          </span>

          <span class="vk-wall__desc">
            ${data.text.replace(/\n/gm,' ')}
          </span>
        </span>

        <span class="vk-wall__bg">
          <img src="${data.imageUrl}" alt="">
        </span>
      </span>
    </a>
  `

  wrapper.innerHTML += vkItemTemplate;
}
