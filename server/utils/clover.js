const CLOVER_API_BASE = 'https://api.clover.com/v3';

const getConfig = () => {
  const { CLOVER_MERCHANT_ID, CLOVER_API_TOKEN } = process.env;
  if (!CLOVER_MERCHANT_ID || !CLOVER_API_TOKEN) return null;
  return { merchantId: CLOVER_MERCHANT_ID, token: CLOVER_API_TOKEN };
};

const cloverRequest = async (path, options = {}) => {
  const config = getConfig();
  if (!config) throw new Error('Clover credentials not configured');

  const res = await fetch(`${CLOVER_API_BASE}/merchants/${config.merchantId}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.token}`,
      ...options.headers
    }
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Clover request failed (${res.status})`);
  return data;
};

// Pushes a placed order into Clover as a new order with line items.
// Returns the Clover order id, or null if Clover isn't configured / the push fails.
const pushOrderToClover = async (order) => {
  if (!getConfig()) return null;

  try {
    const cloverOrder = await cloverRequest('/orders', {
      method: 'POST',
      body: JSON.stringify({
        state: 'open',
        note: order.specialInstructions || undefined
      })
    });

    for (const item of order.items) {
      await cloverRequest(`/orders/${cloverOrder.id}/line_items`, {
        method: 'POST',
        body: JSON.stringify({
          name: item.size ? `${item.name} (${item.size})` : item.name,
          price: Math.round(item.price * 100), // dollars -> cents
          unitQty: item.quantity * 1000 // Clover stores quantity in thousandths
        })
      });
    }

    return cloverOrder.id;
  } catch (err) {
    console.error('❌ Clover sync error:', err.message);
    return null;
  }
};

module.exports = { pushOrderToClover };
