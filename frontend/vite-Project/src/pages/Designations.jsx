import LookupManager from './LookupManager';
import { designationService } from '../services/lookupService';

export default function Designations() {
  return (
    <LookupManager
      title="Designations"
      subtitle="Manage job titles employees can be assigned to."
      itemLabel="Designation"
      fieldKey="title"
      service={designationService}
    />
  );
}