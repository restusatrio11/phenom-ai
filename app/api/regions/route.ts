import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://www.emsifa.com/api-wilayah-indonesia/api';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const provinceId = searchParams.get('provinceId');

  try {
    if (provinceId) {
      // Fetch Regencies/Cities for a specific province
      const res = await fetch(`${API_BASE_URL}/regencies/${provinceId}.json`);
      if (!res.ok) throw new Error('Gagal mengambil data kabupaten/kota');
      const data = await res.json();
      // Format to { id, name }
      return NextResponse.json({ success: true, data });
    } else {
      // Fetch all Provinces
      const res = await fetch(`${API_BASE_URL}/provinces.json`);
      if (!res.ok) throw new Error('Gagal mengambil data provinsi');
      const data = await res.json();
      // Format to { id, name }
      return NextResponse.json({ success: true, data });
    }
  } catch (error: any) {
    console.error('Fetch Regions Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
