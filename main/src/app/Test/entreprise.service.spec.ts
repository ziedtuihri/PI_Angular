import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EntrepriseService } from 'src/app/services/Admin-Service/entreprise.service';

// Define interface if not imported
interface Entreprise {
  id: number;
  nom: string;
  email: string;
  statut: 'EN_ATTENTE' | 'VALIDE' | 'REFUSE';
}

describe('EntrepriseService', () => {
  let service: EntrepriseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EntrepriseService]
    });
    service = TestBed.inject(EntrepriseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all entreprises', () => {
    const dummyEntreprises: Entreprise[] = [
      { id: 1, nom: 'Entreprise A', email: 'a@test.com', statut: 'EN_ATTENTE' },
      { id: 2, nom: 'Entreprise B', email: 'b@test.com', statut: 'VALIDE' }
    ];

    service.getAll().subscribe(entreprises => {
      expect(entreprises.length).toBe(2);
      expect(entreprises).toEqual(dummyEntreprises);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyEntreprises);
  });

  it('should get entreprise by id', () => {
    const dummyEntreprise: Entreprise = {
      id: 1, nom: 'Entreprise A', email: 'a@test.com', statut: 'EN_ATTENTE'
    };

    service.getById(1).subscribe(data => {
      expect(data).toEqual(dummyEntreprise);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyEntreprise);
  });
});
