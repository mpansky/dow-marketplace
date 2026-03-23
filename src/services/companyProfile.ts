import { supabase } from '@/lib/supabase'
import type { CompanyProfile, CompanyLocation, CompanyContact, CompanyDesignations, CompanyNAICSCode, CompanyCompliance, CompanyContractVehicle, CompanyPlatformRegistration, CompanyTag, CompanyProduct, CompanyPastPerformance } from '@/types/companyProfile'

export async function fetchCompanyProfile(vendorSlug: string): Promise<CompanyProfile | null> {
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('vendor_slug', vendorSlug)
    .maybeSingle()

  if (!company) return null

  const [
    { data: locations },
    { data: contacts },
    { data: designations },
    { data: naicsCodes },
    { data: compliance },
    { data: contractVehicles },
    { data: platformRegs },
    { data: tags },
    { data: products },
    { data: pastPerf },
    { data: documents },
  ] = await Promise.all([
    supabase.from('company_locations').select('*').eq('company_id', company.id),
    supabase.from('company_contacts').select('*').eq('company_id', company.id),
    supabase.from('company_designations').select('*').eq('company_id', company.id).maybeSingle(),
    supabase.from('company_naics_codes').select('*').eq('company_id', company.id),
    supabase.from('company_compliance').select('*').eq('company_id', company.id).maybeSingle(),
    supabase.from('company_contract_vehicles').select('*').eq('company_id', company.id),
    supabase.from('company_platform_registrations').select('*').eq('company_id', company.id),
    supabase.from('company_tags').select('*').eq('company_id', company.id),
    supabase.from('company_products').select('*').eq('company_id', company.id),
    supabase.from('company_past_performance').select('*').eq('company_id', company.id),
    supabase.from('company_documents').select('*').eq('company_id', company.id),
  ])

  return {
    ...company,
    locations: locations || [],
    contacts: contacts || [],
    designations: designations || null,
    naics_codes: naicsCodes || [],
    compliance: compliance || null,
    contract_vehicles: contractVehicles || [],
    platform_registrations: platformRegs || [],
    tags: tags || [],
    products: products || [],
    past_performance: pastPerf || [],
    documents: documents || [],
  } as CompanyProfile
}

export async function upsertCompany(profile: Partial<CompanyProfile> & { vendor_slug: string; name: string }): Promise<string> {
  const { locations, contacts, designations, naics_codes, compliance, contract_vehicles, platform_registrations, tags, products, past_performance, documents, ...companyData } = profile as CompanyProfile

  const { data, error } = await supabase
    .from('companies')
    .upsert(
      { ...companyData, updated_at: new Date().toISOString() },
      { onConflict: 'vendor_slug' }
    )
    .select('id')
    .single()

  if (error) throw error
  return data.id
}

export async function saveLocations(companyId: string, locations: CompanyLocation[]) {
  await supabase.from('company_locations').delete().eq('company_id', companyId)
  if (locations.length > 0) {
    const rows = locations.map(({ id: _id, ...loc }) => ({ ...loc, company_id: companyId }))
    await supabase.from('company_locations').insert(rows)
  }
}

export async function saveContacts(companyId: string, contacts: CompanyContact[]) {
  await supabase.from('company_contacts').delete().eq('company_id', companyId)
  if (contacts.length > 0) {
    const rows = contacts.map(({ id: _id, ...c }) => ({ ...c, company_id: companyId }))
    await supabase.from('company_contacts').insert(rows)
  }
}

export async function saveDesignations(companyId: string, designations: CompanyDesignations | null) {
  if (!designations) return
  const { id: _id, company_id: _cid, ...data } = designations
  await supabase.from('company_designations').upsert(
    { ...data, company_id: companyId },
    { onConflict: 'company_id' }
  )
}

export async function saveNaicsCodes(companyId: string, codes: CompanyNAICSCode[]) {
  await supabase.from('company_naics_codes').delete().eq('company_id', companyId)
  if (codes.length > 0) {
    const rows = codes.map(({ id: _id, ...c }) => ({ ...c, company_id: companyId }))
    await supabase.from('company_naics_codes').insert(rows)
  }
}

export async function saveCompliance(companyId: string, compliance: CompanyCompliance | null) {
  if (!compliance) return
  const { id: _id, company_id: _cid, ...data } = compliance
  await supabase.from('company_compliance').upsert(
    { ...data, company_id: companyId },
    { onConflict: 'company_id' }
  )
}

export async function saveContractVehicles(companyId: string, vehicles: CompanyContractVehicle[]) {
  await supabase.from('company_contract_vehicles').delete().eq('company_id', companyId)
  if (vehicles.length > 0) {
    const rows = vehicles.map(({ id: _id, ...v }) => ({ ...v, company_id: companyId }))
    await supabase.from('company_contract_vehicles').insert(rows)
  }
}

export async function savePlatformRegistrations(companyId: string, regs: CompanyPlatformRegistration[]) {
  await supabase.from('company_platform_registrations').delete().eq('company_id', companyId)
  if (regs.length > 0) {
    const rows = regs.map(({ id: _id, ...r }) => ({ ...r, company_id: companyId }))
    await supabase.from('company_platform_registrations').insert(rows)
  }
}

export async function saveTags(companyId: string, tags: CompanyTag[]) {
  await supabase.from('company_tags').delete().eq('company_id', companyId)
  if (tags.length > 0) {
    const rows = tags.map(({ id: _id, ...t }) => ({ ...t, company_id: companyId }))
    await supabase.from('company_tags').insert(rows)
  }
}

export async function saveProducts(companyId: string, products: CompanyProduct[]) {
  await supabase.from('company_products').delete().eq('company_id', companyId)
  if (products.length > 0) {
    const rows = products.map(({ id: _id, ...p }) => ({ ...p, company_id: companyId }))
    await supabase.from('company_products').insert(rows)
  }
}

export async function savePastPerformance(companyId: string, records: CompanyPastPerformance[]) {
  await supabase.from('company_past_performance').delete().eq('company_id', companyId)
  if (records.length > 0) {
    const rows = records.map(({ id: _id, ...r }) => ({ ...r, company_id: companyId }))
    await supabase.from('company_past_performance').insert(rows)
  }
}

export async function uploadDocument(companyId: string, file: File, documentType: string): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `${companyId}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('company-assets')
    .upload(path, file)

  if (uploadError) throw uploadError

  const { data: urlData } = supabase.storage
    .from('company-assets')
    .getPublicUrl(path)

  await supabase.from('company_documents').insert({
    company_id: companyId,
    document_type: documentType,
    file_name: file.name,
    storage_path: path,
    file_size: file.size,
    mime_type: file.type,
  })

  return urlData.publicUrl
}

export async function deleteDocument(documentId: string, storagePath: string) {
  await supabase.storage.from('company-assets').remove([storagePath])
  await supabase.from('company_documents').delete().eq('id', documentId)
}

export async function uploadLogo(companyId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `${companyId}/logo.${ext}`

  await supabase.storage.from('company-assets').remove([path])

  const { error } = await supabase.storage
    .from('company-assets')
    .upload(path, file, { upsert: true })

  if (error) throw error

  const { data } = supabase.storage
    .from('company-assets')
    .getPublicUrl(path)

  return data.publicUrl
}

export async function saveFullProfile(profile: CompanyProfile) {
  const companyId = await upsertCompany(profile)

  await Promise.all([
    saveLocations(companyId, profile.locations),
    saveContacts(companyId, profile.contacts),
    saveDesignations(companyId, profile.designations),
    saveNaicsCodes(companyId, profile.naics_codes),
    saveCompliance(companyId, profile.compliance),
    saveContractVehicles(companyId, profile.contract_vehicles),
    savePlatformRegistrations(companyId, profile.platform_registrations),
    saveTags(companyId, profile.tags),
    saveProducts(companyId, profile.products),
    savePastPerformance(companyId, profile.past_performance),
  ])

  return companyId
}
