
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido!' });
  }

  const { amount, description, customer } = req.body;

  if (!amount || !description || !customer) {
    return res.status(400).json({ error: 'Dados incompletos!' });
  }

  const PUSHINPAY_API_KEY = 'TUA_API_KEY_AQUI'; // <<< Troca isso depois.

  try {
    const pushinpayResponse = await fetch('https://api.pushinpay.com.br/api/v1/charge/pix', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PUSHINPAY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        description,
        customer: {
          name: customer.name,
          phone: customer.phone
        }
      })
    });

    const data = await pushinpayResponse.json();

    if (!pushinpayResponse.ok) {
      console.error('Erro PushinPay:', data);
      return res.status(500).json({ error: data.message || 'Erro ao gerar cobrança' });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error('Erro geral:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}
