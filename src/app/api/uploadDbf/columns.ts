const columnsRD = [
    'uf_zi',
    'ano_cmpt',
    'mes_cmpt',
    'espec',
    'cgc_hosp',
    'n_aih',
    'ident',
    'cep',
    'munic_res',
    'nasc',
    'sexo',
    'uti_mes_in',
    'uti_mes_an',
    'uti_mes_al',
    'uti_mes_to',
    'marca_uti',
    'uti_int_in',
    'uti_int_an',
    'uti_int_al',
    'uti_int_to',
    'diar_acom',
    'qt_diarias',
    'proc_solic',
    'proc_rea',
    'val_sh',
    'val_sp',
    'val_sadt',
    'val_rn',
    'val_acomp',
    'val_ortp',
    'val_sangue',
    'val_sadtsr',
    'val_transp',
    'val_obsang',
    'val_ped1ac',
    'val_tot',
    'val_uti',
    'us_tot',
    'dt_inter',
    'dt_saida',
    'diag_princ',
    'diag_secun',
    'cobranca',
    'natureza',
    'gestao',
    'rubrica',
    'ind_vdrl',
    'munic_mov',
    'cod_idade',
    'idade',
    'dias_perm',
    'morte',
    'nacional',
    'num_proc',
    'car_int',
    'tot_pt_sp',
    'cpf_aut',
    'homonimo',
    'num_filhos',
    'instru',
    'cid_notif',
    'contracep1',
    'contracep2',
    'gestrisco',
    'insc_pn',
    'seq_aih5',
    'cbor',
    'cnaer',
    'vincprev',
    'gestor_cod',
    'gestor_tp',
    'gestor_cpf',
    'gestor_dt',
    'cnes',
    'cnpj_mant',
    'infehosp',
    'cid_asso',
    'cid_morte',
    'complex',
    'financ',
    'faec_tp',
    'regct',
    'raca_cor',
    'etnia',
    'sequencia',
    'remessa',
];

const columnsPA = [
    // TODO - Adicionar colunasPA
    'uf_zi',
    'cyto',
    'name',
]

export async function ValidateColumnNames(columns: string[]): Promise<'RD' | 'PA' | 'ERRO'> {
    // SE TODAS AS COLUNAS FOREM IGUAIS DE COLUNASRD, RETORNA 'RD' (mesma ordem)
    // SE TODAS AS COLUNAS FOREM IGUAIS DE COLUNASPA, RETORNA 'PA' (mesma ordem)
    // SE NENHUMA DAS DUAS, RETORNA 'ERRO'

    if (columns.every((column, index) => column === columnsRD[index])) {
        return 'RD';
    }

    if (columns.every((column, index) => column === columnsPA[index])) {
        return 'PA';
    }

    return 'ERRO';
}