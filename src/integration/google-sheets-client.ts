import { CONFIG } from '../config/constants.js';
import type { PropertyListing, SalesCall, Objection, DealStatus, CaseStudy } from '../models/schemas.js';

export class GoogleSheetsClient {
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes

  async initialize(): Promise<void> {
    // In production, initialize Google Sheets auth here
    console.log('GoogleSheetsClient initialized (mock mode)');
  }

  private getCacheKey(sheet: string, range: string): string {
    return `${sheet}:${range}`;
  }

  private getCache(key: string): unknown | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: unknown): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getPropertyListings(): Promise<PropertyListing[]> {
    const cacheKey = this.getCacheKey('Properties', 'A:K');
    const cached = this.getCache(cacheKey) as PropertyListing[] | null;
    if (cached) return cached;

    // Mock data - in production, fetch from Google Sheets
    const listings: PropertyListing[] = [
      {
        id: 'PROP-001',
        address: '123 Oak Street, Austin TX 78701',
        price: 450000,
        bedrooms: 3,
        bathrooms: 2,
        sqft: 2200,
        propertyType: 'residential-single-family',
        agentId: 'AGENT-001',
        listDate: '2024-01-15',
        status: 'active',
      },
      {
        id: 'PROP-002',
        address: '456 Maple Drive, Austin TX 78702',
        price: 625000,
        bedrooms: 4,
        bathrooms: 3,
        sqft: 3100,
        propertyType: 'residential-single-family',
        agentId: 'AGENT-002',
        listDate: '2024-01-10',
        status: 'pending',
      },
    ];

    this.setCache(cacheKey, listings);
    return listings;
  }

  async getSalesCallTranscripts(): Promise<SalesCall[]> {
    const cacheKey = this.getCacheKey('SalesCalls', 'A:L');
    const cached = this.getCache(cacheKey) as SalesCall[] | null;
    if (cached) return cached;

    const calls: SalesCall[] = [
      {
        id: 'CALL-001',
        agentId: 'AGENT-001',
        clientName: 'John Doe',
        propertyId: 'PROP-001',
        duration: 25,
        date: '2024-01-20',
        transcript: 'Client concerned about price per sqft compared to neighborhood averages...',
        remarks: 'Addressed with comp analysis, client interested in viewing',
        objectionType: 'price-objections',
        resolved: true,
      },
    ];

    this.setCache(cacheKey, calls);
    return calls;
  }

  async getObjectionPatterns(): Promise<Objection[]> {
    const cacheKey = this.getCacheKey('Objections', 'A:H');
    const cached = this.getCache(cacheKey) as Objection[] | null;
    if (cached) return cached;

    const objections: Objection[] = [
      {
        id: 'OBJ-001',
        type: 'price-objections',
        description: 'Client believes price is too high for the market',
        category: 'pricing',
        handlingStrategy: 'Present comparable sales analysis, highlight unique features, offer flexible terms',
        successRate: 0.76,
        commonResponses: [
          'Similar properties in this area are selling for $X',
          'This home offers these unique features worth the premium',
          'We can discuss flexible payment terms',
        ],
        dataPoints: { avgResolutionTime: '2-3 days', conversionRate: 0.76 },
      },
      {
        id: 'OBJ-002',
        type: 'location-concerns',
        description: 'Client has concerns about the neighborhood or location',
        category: 'location',
        handlingStrategy: 'Share neighborhood demographics, school ratings, commute data, future development plans',
        successRate: 0.68,
        commonResponses: [
          'This neighborhood is up-and-coming with strong growth',
          'Great schools and amenities nearby',
          'Excellent commute to major employment centers',
        ],
        dataPoints: { avgResolutionTime: '1-2 days', conversionRate: 0.68 },
      },
      {
        id: 'OBJ-003',
        type: 'financing-questions',
        description: 'Client has concerns about financing or affordability',
        category: 'financial',
        handlingStrategy: 'Connect with mortgage brokers, explain loan options, show affordability calculations',
        successRate: 0.82,
        commonResponses: [
          'Let me connect you with our preferred lenders',
          'We can explore different mortgage products',
          'Your monthly payment would be approximately...',
        ],
        dataPoints: { avgResolutionTime: '3-5 days', conversionRate: 0.82 },
      },
    ];

    this.setCache(cacheKey, objections);
    return objections;
  }

  async getDealStatus(dealId: string): Promise<DealStatus | null> {
    const deals: DealStatus[] = [
      {
        id: 'DEAL-001',
        propertyId: 'PROP-001',
        clientId: 'CLIENT-001',
        stage: 'offer-phase',
        objections: ['price-objections'],
        purchasePrice: 425000,
        offerDate: '2024-01-21',
        expectedCloseDate: '2024-03-15',
        agentNotes: 'Client interested but concerned about price',
      },
    ];

    return deals.find((d) => d.id === dealId) || null;
  }

  async getCaseStudies(): Promise<CaseStudy[]> {
    const cacheKey = this.getCacheKey('CaseStudies', 'A:H');
    const cached = this.getCache(cacheKey) as CaseStudy[] | null;
    if (cached) return cached;

    const studies: CaseStudy[] = [
      {
        id: 'CASE-001',
        propertyAddress: '789 Pine Road, Austin TX 78703',
        clientCompany: 'Tech Executive',
        objectionType: 'price-objections',
        resolution: 'Presented comp analysis showing property was below market value',
        outcome: 'Client increased offer to listing price, deal closed in 30 days',
        metrics: { daysToClose: 30, finalPrice: 650000, originalOffer: 600000 },
        lessonLearned: 'Data-backed comp analysis is highly effective for price objections',
      },
    ];

    this.setCache(cacheKey, studies);
    return studies;
  }

  async getBrandGuidelines(): Promise<Record<string, unknown>[]> {
    const cacheKey = this.getCacheKey('Brand', 'A:E');
    const cached = this.getCache(cacheKey) as Record<string, unknown>[] | null;
    if (cached) return cached;

    const guidelines = [
      {
        category: 'tone',
        rule: 'Be professional yet approachable',
        examples: ['You have great taste in homes!', 'This neighborhood has strong fundamentals'],
        doNots: ['Aggressive selling tactics', 'Dismissing client concerns'],
      },
    ];

    this.setCache(cacheKey, guidelines);
    return guidelines;
  }

  async searchTranscripts(keyword: string): Promise<SalesCall[]> {
    const calls = await this.getSalesCallTranscripts();
    return calls.filter(
      (c) =>
        c.transcript.toLowerCase().includes(keyword.toLowerCase()) ||
        c.remarks.toLowerCase().includes(keyword.toLowerCase()),
    );
  }

  async getCompetitorAnalysis(): Promise<Record<string, unknown>> {
    return {
      competitors: [
        {
          name: 'Competitor A',
          avgListPrice: 520000,
          daysOnMarket: 28,
          priceReduction: '5%',
        },
      ],
    };
  }

  clearCache(): void {
    this.cache.clear();
  }
}
