/** @type {HTMLDivElement} */
let block;
/** @type {string} */
let redirect;

function showError(error) {
  const eObj = typeof error === 'object' ? error : { general: error };

  if (eObj.username) {
    const hintUser = block.querySelector(':scope span.hint.hint-username');
    if (hintUser) {
      hintUser.innerText = eObj.username;
    }
  }
  if (eObj.password) {
    const hintPass = block.querySelector(':scope span.hint.hint-password');
    if (hintPass) {
      hintPass.innerText = eObj.username;
    }
  }
  if (eObj.general) {
    const hintGeneral = block.querySelector(':scope span.hint.hint-general');
    hintGeneral.innerText = eObj.general;
  }
}

/**
 * Login
 * @param {string} username
 * @param {string} password
 * @returns {Promise<false|undefined>}
 */
async function login(username, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers: {
      'content-type': 'application/json',
    },
  });

  if (!res.ok) {
    try {
      const { error } = await res.json();
      if (error)showError(error);
    } catch (_) {
      // noop
    }
    return false;
  }

  if (redirect && redirect !== window.location.href) {
    window.location.assign(redirect);
  } else {
    window.location.reload();
  }
  return true;
}

/**
 * Logout
 * @param {string} token
 * @returns {Promise<false|undefined>}
 */
async function logout(token) {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ token }),
    headers: {
      'content-type': 'application/json',
    },
  });

  if (!res.ok) {
    try {
      const { error } = await res.json();
      if (error)showError(error);
    } catch (_) {
      // noop
    }
    return false;
  }

  window.location.reload();
  return true;
}

function loginTemplate() {
  return /* html */`
<form id="auth">
  <div class="field-wrapper">
    <label for="username" class="required">
      Username
    </label>
    <input type="text" id="username" required autocomplete="username"/>
    <span class="hint hint-username"></span>
  </div>

  <div class="field-wrapper">
    <label for="password" class="required">
      Password
    </label>
    <input type="password" id="password" required autocomplete="current-password"/>
    <span class="hint hint-password"></span>
  </div>

  <div class="form-submit-wrapper field-wrapper">
    <button class="button" id="btn-submit">Submit</button>
  </div>
  <span class="hint hint-general"></span>
</form>
  `;
}

function logoutTemplate() {
  return /* html */`
<form id="auth">
  <div class="form-submit-wrapper field-wrapper">
    <button class="button" id="btn-submit">Logout</button>
  </div>
  <span class="hint hint-general"></span>
</form>
  `;
}

function parseCookies() {
  if (!document.cookie) {
    return {};
  }

  const cookies = document.cookie.split(';').map((s) => s.trim());

  const obj = {};
  cookies.forEach((c) => {
    const [key, ...vals] = c.split('=');
    obj[key] = vals.join('=');
  });

  return obj;
}

function removeAuthCookie() {
  document.cookie = 'token=;max-age=-1;';
  return false;
}

function isAuthenticated() {
  const cookies = parseCookies();
  if (!cookies.token) {
    return false;
  }

  const [header, payload, signature] = cookies.token.split('.');
  if (!header || !payload || !signature) {
    return removeAuthCookie();
  }

  try {
    const decoded = JSON.parse(atob(payload));

    // assume the signature is valid, just check for expiration
    if (Date.now() / 1000 > decoded.exp) {
      return removeAuthCookie();
    }
    window.session = decoded;
  } catch (e) {
    console.error('[login-form] isAuthenticated() error: ', e);
    return removeAuthCookie();
  }

  return true;
}

/**
 * @param {HTMLDivElement} block
 */
export default async function decorate($block) {
  block = $block;

  const token = isAuthenticated();
  if (!token) {
    block.innerHTML = loginTemplate();
  } else {
    block.innerHTML = logoutTemplate();
  }

  block.classList.add('form');
  block.parentElement.classList.add('form-wrapper');
  block.parentElement.parentElement.classList.add('form-container');

  const { hash } = window.location;
  if (hash) {
    window.location.hash = '';
    redirect = decodeURIComponent(hash);
  }

  const submitBtn = block.querySelector('#btn-submit');
  submitBtn.addEventListener('click', async (event) => {
    const form = submitBtn.closest('form');
    if (form.checkValidity()) {
      event.preventDefault();
      submitBtn.setAttribute('disabled', '');
      let ok = false;

      if (!token) {
        const user = form.querySelector(':scope input#username').value;
        const pass = form.querySelector(':scope input#password').value;
        ok = await login(user, pass);
      } else {
        ok = await logout(token);
      }
      if (!ok) {
        submitBtn.removeAttribute('disabled');
      }
    }
  });
}
