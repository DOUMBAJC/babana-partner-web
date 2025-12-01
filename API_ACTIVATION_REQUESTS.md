# 📋 Guide API - Activation Requests & Customers

Guide complet pour l'utilisation des services et hooks liés aux **requêtes d'activation de SIM** et aux **clients** dans BABANA Partner Web.

## 📑 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Types TypeScript](#types-typescript)
3. [Services API](#services-api)
4. [Hooks React](#hooks-react)
5. [Exemples pratiques](#exemples-pratiques)
6. [Gestion des erreurs](#gestion-des-erreurs)

---

## 🎯 Vue d'ensemble

### Flux de travail

1. **BA (Brand Ambassador)** :
   - Crée des clients (`Customer`)
   - Soumet des requêtes d'activation (`ActivationRequest`) avec numéro SIM, ICCID, IMEI
   - Peut modifier/annuler ses requêtes en attente

2. **Activateur** :
   - Consulte les requêtes en attente
   - Accepte ou rejette les requêtes
   - Ajoute des notes administratives

### Statuts des requêtes

- `pending` : En attente de traitement
- `processing` : En cours de traitement
- `activated` : Activée avec succès
- `rejected` : Rejetée par l'activateur
- `cancelled` : Annulée par le BA

---

## 📦 Types TypeScript

### Customer (Client)

```typescript
interface Customer {
  id: number;
  fullName: string;
  idCardTypeId: number;
  idCardNumber: string;
  phone: string;
  phoneOperator: string;
  address?: string;
  email?: string;
  createdBy: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;

  // Relations
  idCardType?: IdCardType;
  creator?: { id: number; name: string; email: string };
  activationRequestsCount?: number;
}
```

### ActivationRequest (Requête d'activation)

```typescript
interface ActivationRequest {
  id: number;
  baId: number;
  customerId: number;
  processedBy?: number;
  simNumber: string;
  iccid: string;
  imei?: string;
  status: ActivationRequestStatus;
  baNotes?: string;
  adminNotes?: string;
  rejectionReason?: string;
  submittedAt?: string;
  processedAt?: string;
  activatedAt?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;

  // Relations
  ba?: { id: number; name: string; email: string };
  customer?: Customer;
  processor?: { id: number; name: string; email: string };
  history?: ActivationHistory[];
}
```

### Filtres de recherche

```typescript
interface CustomerFilters {
  search?: string;
  idCardTypeId?: number;
  idCardNumber?: string;
  phone?: string;
  phoneOperator?: string;
  createdBy?: number;
  createdFrom?: string;
  createdTo?: string;
}

interface ActivationRequestFilters {
  search?: string;
  status?: ActivationRequestStatus | ActivationRequestStatus[];
  baId?: number;
  customerId?: number;
  processedBy?: number;
  simNumber?: string;
  iccid?: string;
  submittedFrom?: string;
  submittedTo?: string;
  processedFrom?: string;
  processedTo?: string;
  activatedFrom?: string;
  activatedTo?: string;
}
```

---

## 🔌 Services API

### Customer Service

```typescript
import { customerService } from '~/lib';

// Récupérer la liste des clients (paginée)
const { data, meta } = await customerService.getCustomers(
  { phoneOperator: 'CAMTEL' },
  { page: 1, perPage: 10, sortBy: 'createdAt', sortOrder: 'desc' }
);

// Récupérer un client par numéro de carte d'identité
const customer = await customerService.getCustomerByIdCard('123456789', ['idCardType', 'creator']);

// Créer un nouveau client
const newCustomer = await customerService.createCustomer({
  fullName: 'Jean Dupont',
  idCardTypeId: 1,
  idCardNumber: '123456789',
  phone: '237612345678',
  phoneOperator: 'CAMTEL',
  address: 'Yaoundé, Cameroun',
  email: 'jean@example.com',
});

// Modifier un client
const updatedCustomer = await customerService.updateCustomer(1, {
  phone: '237699999999',
});

// Supprimer un client
await customerService.deleteCustomer(1);

// Rechercher par CNI
const customer = await customerService.searchByIdCard(1, '123456789');

// Rechercher par téléphone
const customer = await customerService.searchByPhone('237612345678');

// Récupérer les types de carte d'identité
const idCardTypes = await customerService.getIdCardTypes();

// Récupérer les clients d'un BA
const { data, meta } = await customerService.getCustomersByBa(baId, { page: 1 });
```

### Activation Request Service

```typescript
import { activationRequestService } from '~/lib';

// Récupérer la liste des requêtes (paginée)
const { data, meta } = await activationRequestService.getActivationRequests(
  { status: 'pending' },
  { page: 1, perPage: 10, sortBy: 'submittedAt', sortOrder: 'desc' }
);

// Récupérer une requête par ID
const request = await activationRequestService.getActivationRequestById(
  1,
  ['ba', 'customer', 'processor', 'history']
);

// Créer une requête (BA)
const newRequest = await activationRequestService.createActivationRequest({
  customerId: 1,
  simNumber: '237612345678',
  iccid: '89237010000000000001',
  imei: '123456789012345',
  baNotes: 'Nouveau client VIP',
});

// Modifier une requête (BA - seulement si pending ou rejected)
const updatedRequest = await activationRequestService.updateActivationRequest(1, {
  simNumber: '237699999999',
  baNotes: 'Numéro corrigé',
});

// Annuler une requête (BA - seulement si pending)
const cancelledRequest = await activationRequestService.cancelActivationRequest(1);

// Accepter une requête (Activateur)
const acceptedRequest = await activationRequestService.acceptActivationRequest(
  1,
  'Vérification effectuée avec succès'
);

// Rejeter une requête (Activateur)
const rejectedRequest = await activationRequestService.rejectActivationRequest(
  1,
  'CNI non valide',
  'Document expiré depuis 2 mois'
);

// Traiter une requête (Activateur - avancé)
const processedRequest = await activationRequestService.processActivationRequest(1, {
  status: 'activated',
  adminNotes: 'Activation manuelle effectuée',
});

// Récupérer les requêtes d'un BA
const { data, meta } = await activationRequestService.getActivationRequestsByBa(
  baId,
  { status: ['pending', 'processing'] }
);

// Récupérer les requêtes traitées par un activateur
const { data, meta } = await activationRequestService.getActivationRequestsByProcessor(
  processorId,
  { processedFrom: '2025-01-01' }
);

// Récupérer l'historique d'une requête
const history = await activationRequestService.getActivationRequestHistory(1);

// Récupérer les statistiques
const stats = await activationRequestService.getActivationRequestStats({
  baId: 1,
  submittedFrom: '2025-01-01',
  submittedTo: '2025-01-31',
});

// Rechercher par numéro SIM
const requests = await activationRequestService.searchBySimNumber('237612345678');

// Rechercher par ICCID
const requests = await activationRequestService.searchByIccid('89237010000000000001');

// Exporter les requêtes
const blob = await activationRequestService.exportActivationRequests(
  { status: 'activated', submittedFrom: '2025-01-01' },
  'excel'
);
```

---

## ⚛️ Hooks React

### Hooks pour les Clients

#### useCustomers - Liste des clients

```typescript
import { useCustomers } from '~/hooks';

function CustomerList() {
  const {
    customers,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    params,
    setParams,
    refresh,
  } = useCustomers(
    { phoneOperator: 'CAMTEL' },
    { page: 1, perPage: 10, sortBy: 'createdAt', sortOrder: 'desc' }
  );

  if (loading) return <Loader />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <div>
      {customers.map(customer => (
        <CustomerCard key={customer.id} customer={customer} />
      ))}
      <Pagination meta={pagination} onChange={(page) => setParams({ ...params, page })} />
    </div>
  );
}
```

#### useCustomer - Client spécifique

```typescript
import { useCustomer } from '~/hooks';

function CustomerDetails({ customerId }) {
  const { customer, loading, error, refresh } = useCustomer(
    customerId,
    ['idCardType', 'creator']
  );

  if (loading) return <Loader />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!customer) return <NotFound />;

  return (
    <div>
      <h1>{customer.fullName}</h1>
      <p>Téléphone: {customer.phone}</p>
      <p>CNI: {customer.idCardType?.name} - {customer.idCardNumber}</p>
      <button onClick={refresh}>Actualiser</button>
    </div>
  );
}
```

#### useCreateCustomer - Créer un client

```typescript
import { useCreateCustomer } from '~/hooks';
import { useForm } from 'react-hook-form';

function CreateCustomerForm() {
  const { createCustomer, loading, error } = useCreateCustomer();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const customer = await createCustomer(data);
    if (customer) {
      console.log('Client créé:', customer);
      // Rediriger vers la liste ou afficher un message de succès
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('fullName')} placeholder="Nom complet" />
      <input {...register('phone')} placeholder="Téléphone" />
      <button type="submit" disabled={loading}>
        {loading ? 'Création...' : 'Créer'}
      </button>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </form>
  );
}
```

#### useUpdateCustomer - Modifier un client

```typescript
import { useUpdateCustomer } from '~/hooks';

function EditCustomerForm({ customer }) {
  const { updateCustomer, loading, error } = useUpdateCustomer();

  const handleUpdate = async (data) => {
    const updated = await updateCustomer(customer.id, data);
    if (updated) {
      console.log('Client mis à jour');
    }
  };

  return <form onSubmit={handleSubmit(handleUpdate)}>...</form>;
}
```

#### useDeleteCustomer - Supprimer un client

```typescript
import { useDeleteCustomer } from '~/hooks';

function DeleteCustomerButton({ customerId }) {
  const { deleteCustomer, loading, error } = useDeleteCustomer();

  const handleDelete = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      const success = await deleteCustomer(customerId);
      if (success) {
        console.log('Client supprimé');
      }
    }
  };

  return (
    <button onClick={handleDelete} disabled={loading}>
      {loading ? 'Suppression...' : 'Supprimer'}
    </button>
  );
}
```

#### useIdCardTypes - Types de carte d'identité

```typescript
import { useIdCardTypes } from '~/hooks';

function IdCardTypeSelect() {
  const { idCardTypes, loading, error } = useIdCardTypes();

  if (loading) return <Loader />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <select>
      {idCardTypes.map(type => (
        <option key={type.id} value={type.id}>
          {type.name}
        </option>
      ))}
    </select>
  );
}
```

### Hooks pour les Requêtes d'Activation

#### useActivationRequests - Liste des requêtes

```typescript
import { useActivationRequests } from '~/hooks';

function PendingRequestsList() {
  const {
    requests,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    refresh,
  } = useActivationRequests(
    { status: 'pending' },
    { page: 1, perPage: 10, sortBy: 'submittedAt', sortOrder: 'desc' }
  );

  if (loading) return <Loader />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <div>
      <button onClick={() => setFilters({ status: 'activated' })}>
        Voir les activées
      </button>
      {requests.map(request => (
        <RequestCard key={request.id} request={request} />
      ))}
    </div>
  );
}
```

#### useActivationRequest - Requête spécifique

```typescript
import { useActivationRequest } from '~/hooks';

function RequestDetails({ requestId }) {
  const { request, loading, error, refresh } = useActivationRequest(
    requestId,
    ['ba', 'customer', 'processor', 'history']
  );

  if (loading) return <Loader />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!request) return <NotFound />;

  return (
    <div>
      <h1>Requête #{request.id}</h1>
      <p>BA: {request.ba?.name}</p>
      <p>Client: {request.customer?.fullName}</p>
      <p>SIM: {request.simNumber}</p>
      <p>Statut: {request.status}</p>
    </div>
  );
}
```

#### useCreateActivationRequest - Créer une requête (BA)

```typescript
import { useCreateActivationRequest } from '~/hooks';

function CreateRequestForm() {
  const { createRequest, loading, error } = useCreateActivationRequest();

  const onSubmit = async (data) => {
    const request = await createRequest({
      customerId: data.customerId,
      simNumber: data.simNumber,
      iccid: data.iccid,
      imei: data.imei,
      baNotes: data.notes,
    });

    if (request) {
      console.log('Requête créée:', request);
      navigate(`/requests/${request.id}`);
    }
  };

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

#### useProcessActivationRequest - Traiter une requête (Activateur)

```typescript
import { useProcessActivationRequest } from '~/hooks';

function ProcessRequestActions({ requestId }) {
  const { acceptRequest, rejectRequest, loading, error } = useProcessActivationRequest();

  const handleAccept = async () => {
    const request = await acceptRequest(requestId, 'Vérification effectuée');
    if (request) {
      console.log('Requête acceptée');
      refresh();
    }
  };

  const handleReject = async () => {
    const reason = prompt('Raison du rejet:');
    if (reason) {
      const request = await rejectRequest(requestId, reason);
      if (request) {
        console.log('Requête rejetée');
        refresh();
      }
    }
  };

  return (
    <div>
      <button onClick={handleAccept} disabled={loading}>
        Accepter
      </button>
      <button onClick={handleReject} disabled={loading}>
        Rejeter
      </button>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  );
}
```

#### useActivationRequestStats - Statistiques

```typescript
import { useActivationRequestStats } from '~/hooks';

function Dashboard() {
  const { stats, loading, error, refresh } = useActivationRequestStats({
    submittedFrom: '2025-01-01',
  });

  if (loading) return <Loader />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <div>
      <StatCard title="Total" value={stats?.total} />
      <StatCard title="En attente" value={stats?.pending} />
      <StatCard title="Activées" value={stats?.activated} />
      <StatCard title="Rejetées" value={stats?.rejected} />
      <StatCard title="Taux de succès" value={`${stats?.successRate}%`} />
      <StatCard
        title="Temps moyen"
        value={`${stats?.averageProcessingTime}h`}
      />
    </div>
  );
}
```

---

## 💡 Exemples pratiques

### Workflow complet BA

```typescript
import {
  useCreateCustomer,
  useCreateActivationRequest,
  useIdCardTypes,
} from '~/hooks';

function NewActivationWorkflow() {
  const [step, setStep] = useState(1);
  const [customerId, setCustomerId] = useState<number>();

  const { createCustomer, loading: loadingCustomer } = useCreateCustomer();
  const { createRequest, loading: loadingRequest } = useCreateActivationRequest();
  const { idCardTypes } = useIdCardTypes();

  // Étape 1: Créer le client
  const handleCreateCustomer = async (data) => {
    const customer = await createCustomer(data);
    if (customer) {
      setCustomerId(customer.id);
      setStep(2);
    }
  };

  // Étape 2: Créer la requête d'activation
  const handleCreateRequest = async (data) => {
    if (!customerId) return;

    const request = await createRequest({
      customerId,
      ...data,
    });

    if (request) {
      navigate('/requests?success=true');
    }
  };

  return (
    <div>
      {step === 1 && (
        <CustomerForm
          idCardTypes={idCardTypes}
          onSubmit={handleCreateCustomer}
          loading={loadingCustomer}
        />
      )}
      {step === 2 && (
        <ActivationRequestForm
          onSubmit={handleCreateRequest}
          loading={loadingRequest}
        />
      )}
    </div>
  );
}
```

### Dashboard Activateur

```typescript
import {
  useActivationRequests,
  useActivationRequestStats,
  useProcessActivationRequest,
} from '~/hooks';

function ActivatorDashboard() {
  const { requests, loading, refresh } = useActivationRequests(
    { status: 'pending' },
    { perPage: 5 }
  );
  const { stats } = useActivationRequestStats();
  const { acceptRequest, rejectRequest } = useProcessActivationRequest();

  const handleQuickAccept = async (id: number) => {
    await acceptRequest(id);
    refresh();
  };

  const handleQuickReject = async (id: number, reason: string) => {
    await rejectRequest(id, reason);
    refresh();
  };

  return (
    <div>
      <StatsOverview stats={stats} />
      <PendingRequestsList
        requests={requests}
        onAccept={handleQuickAccept}
        onReject={handleQuickReject}
        loading={loading}
      />
    </div>
  );
}
```

---

## ⚠️ Gestion des erreurs

Toutes les fonctions retournent des erreurs typées `ApiError` :

```typescript
interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}
```

### Gestion des erreurs dans les hooks

```typescript
const { createCustomer, loading, error } = useCreateCustomer();

const handleSubmit = async (data) => {
  const customer = await createCustomer(data);
  
  // Si une erreur survient, `customer` sera null et `error` contiendra le message
  if (!customer) {
    console.error(error); // "Email déjà utilisé"
    return;
  }
  
  // Succès
  console.log('Client créé:', customer);
};
```

### Gestion des erreurs dans les services

```typescript
import { customerService } from '~/lib';
import type { ApiError } from '~/types';

try {
  const customer = await customerService.createCustomer(data);
  console.log('Succès:', customer);
} catch (err) {
  const error = err as ApiError;
  
  if (error.status === 422) {
    console.error('Données invalides:', error.details);
  } else if (error.status === 403) {
    console.error('Permission refusée');
  } else {
    console.error('Erreur:', error.message);
  }
}
```

---

## 📚 Ressources

- [Types TypeScript](/app/types)
- [Services API](/app/lib)
- [Hooks React](/app/hooks)
- [Guide d'authentification](./AUTH_GUIDE.md)
- [Configuration HTTP](./HTTP_CONFIG.md)

---

**Note**: Assurez-vous que votre backend Laravel expose ces endpoints avec les mêmes structures de données. Adaptez les URLs et les champs selon vos besoins spécifiques.

