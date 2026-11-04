(() => {
  const ADMIN_UID = '44ef2acd-d7d6-4de4-b6ba-c4295168b546';
  const BUCKET = 'product-images';
  const $ = id => document.getElementById(id);
  const say = (id, message) => { $(id).textContent = message || ''; };
  const url = window.HOF_SUPABASE_URL;
  const key = window.HOF_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || url.includes('PASTE_') || key.includes('PASTE_')) {
    say('login-message', 'Supabase connection is not configured. Check config.js.'); return;
  }
  const db = window.supabase.createClient(url, key);
  let currentImages = [];

  async function verifyAdmin() {
    const { data: { user }, error } = await db.auth.getUser();
    if (error || !user || user.id !== ADMIN_UID) {
      await db.auth.signOut(); $('login-panel').style.display = 'block'; $('dashboard').style.display = 'none';
      if (user && user.id !== ADMIN_UID) say('login-message', 'This account is not authorised to manage HOF products.');
      return false;
    }
    $('login-panel').style.display = 'none'; $('dashboard').style.display = 'block';
    await loadProducts(); return true;
  }

  $('login-form').addEventListener('submit', async e => {
    e.preventDefault(); say('login-message', 'Signing in…');
    const { error } = await db.auth.signInWithPassword({ email: $('email').value.trim(), password: $('password').value });
    if (error) { say('login-message', error.message); return; }
    await verifyAdmin();
  });
  $('logout').addEventListener('click', async () => { await db.auth.signOut(); $('dashboard').style.display='none'; $('login-panel').style.display='block'; say('login-message','You have signed out.'); });

  async function loadProducts() {
    say('list-message', 'Loading products…');
    const { data, error } = await db.from('products').select('*').order('created_at', { ascending: false });
    if (error) { say('list-message', `Could not load products: ${error.message}`); return; }
    const list = $('product-list'); list.replaceChildren();
    if (!data.length) { say('list-message', 'No products yet. Add your first product above.'); return; }
    say('list-message', `${data.length} product(s) in your catalogue.`);
    data.forEach(product => {
      const row = document.createElement('article'); row.className = 'admin-product';
      const img = document.createElement('img'); img.alt = product.name;
      const first = Array.isArray(product.images) ? product.images[0] : '';
      if (first) img.src = first;
      const details = document.createElement('div');
      const title = document.createElement('h3'); title.textContent = product.name;
      const meta = document.createElement('p'); meta.textContent = `₦${Number(product.price).toLocaleString('en-NG')} / ${product.unit || 'item'} · ${product.category} · ${product.is_available ? 'Available' : 'Unavailable'}${product.is_new_arrival ? ' · New arrival' : ''}`;
      details.append(title, meta);
      const actions = document.createElement('div'); actions.className = 'admin-product-actions';
      const edit = document.createElement('button'); edit.className='admin-secondary'; edit.textContent='Edit'; edit.addEventListener('click', () => startEdit(product));
      const del = document.createElement('button'); del.className='admin-secondary'; del.textContent='Delete'; del.addEventListener('click', () => deleteProduct(product));
      actions.append(edit, del); row.append(img, details, actions); list.append(row);
    });
  }

  function startEdit(p) {
    $('product-id').value = p.id; $('name').value = p.name || ''; $('price').value = p.price ?? '';
    $('category').value = p.category || ''; $('unit').value = p.unit || 'yard'; $('description').value = p.description || '';
    $('available').checked = p.is_available !== false; $('new-arrival').checked = p.is_new_arrival === true;
    currentImages = Array.isArray(p.images) ? [...p.images] : [];
    $('form-title').textContent = 'Edit product'; $('save-button').textContent = 'Update product'; $('cancel-edit').classList.remove('hidden');
    $('product-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
    say('form-message', `Existing photos: ${currentImages.length}. Any new photos you select will be added.`);
  }
  function resetForm() {
    $('product-form').reset(); $('product-id').value=''; $('available').checked=true; currentImages=[];
    $('form-title').textContent='Add a product'; $('save-button').textContent='Save product'; $('cancel-edit').classList.add('hidden'); say('form-message','');
  }
  $('cancel-edit').addEventListener('click', resetForm);

  async function uploadImages(files) {
    const uploaded = [];
    for (const file of files) {
      if (!file.type.startsWith('image/')) throw new Error(`${file.name} is not an image.`);
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
      const path = `${ADMIN_UID}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
      const { error } = await db.storage.from(BUCKET).upload(path, file, { upsert: false, contentType: file.type });
      if (error) throw error;
      const { data } = db.storage.from(BUCKET).getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }
    return uploaded;
  }

  $('product-form').addEventListener('submit', async e => {
    e.preventDefault(); $('save-button').disabled=true; say('form-message','Saving product…');
    try {
      const files = [...$('images').files];
      const newUrls = files.length ? await uploadImages(files) : [];
      const record = {
        name: $('name').value.trim(), price: Number($('price').value), category: $('category').value,
        unit: $('unit').value, description: $('description').value.trim(), images: [...currentImages, ...newUrls],
        is_available: $('available').checked, is_new_arrival: $('new-arrival').checked
      };
      const id = $('product-id').value;
      const result = id ? await db.from('products').update(record).eq('id', id) : await db.from('products').insert(record);
      if (result.error) throw result.error;
      say('form-message', id ? 'Product updated successfully.' : 'Product added successfully.');
      resetForm(); await loadProducts();
    } catch (err) { say('form-message', `Save failed: ${err.message || err}`); }
    finally { $('save-button').disabled=false; }
  });

  async function deleteProduct(p) {
    if (!confirm(`Delete “${p.name}” from the catalogue? This cannot be undone.`)) return;
    say('list-message','Deleting product…');
    const { error } = await db.from('products').delete().eq('id', p.id);
    if (error) { say('list-message', `Delete failed: ${error.message}`); return; }
    say('list-message','Product deleted.'); await loadProducts();
  }
  $('refresh').addEventListener('click', loadProducts);
  verifyAdmin();
})();
