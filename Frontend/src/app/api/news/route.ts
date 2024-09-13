import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch('https://newsdata.io/api/1/latest?country=ma&category=business&apikey=pub_49149183901af5c7fda40d4500c43f906a8d0');
        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`HTTP error! Status: ${response.status} - ${errorDetails}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data);  // Log the response data
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching articles:', error);
        return NextResponse.json({ error: error.message });
    }
}
