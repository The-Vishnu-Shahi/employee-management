import LookupManager from './LookupManager';
import { departmentService } from '../services/lookupService';

export default function Departments() {
  return (
    <LookupManager
      title="Departments"
      subtitle="Manage the departments employees can be assigned to."
      itemLabel="Department"
      fieldKey="name"
      service={departmentService}
    />
  );
}