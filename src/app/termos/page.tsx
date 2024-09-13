import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import './styles.css';

export default function Termos() {
    return (
    <main id="termos">        
        <h1 className="mb-4 text-4xl leading-none tracking-tight md:text-4xl lg:text-5xl dark:text-white self-center"><u>Termo de Uso</u></h1>
        <p>Para acessar determinados serviços do Grupo PWR, temos o compromisso de esclarecer quais são seus direitos, suas obr/igações e como entrar em contato conosco, caso possua alguma dúvida e/ou reclamação.</p>
        <h4>Seus direitos</h4>
        <span className="self-center">Como titular dos dados, você possui os seguintes direitos (Lei Geral de Proteção de Dados Pessoais):</span><br/>
        <ol className="list-decimal marker:font-bold">
            <li>
                <strong>Confirmação e acesso</strong>
                <p>É o direito de obter a <strong>conﬁrmação</strong> de quais dados pessoais são ou não objeto de tratamento e, se for esse o caso, o direito de <strong>acessar</strong> os seus dados pessoais. (art. 18, I e II).</p>
            </li>
            <li>
                <strong>Retificação</strong>
                <p>É o direito de solicitar a <strong>correção</strong> de dados incompletos, inexatos ou desatualizados. (art. 18, III).</p>
            </li>
            <li>
                <strong>Limitação do tratamento de dados</strong>
                <p>É o direito de limitar o tratamento de seus dados pessoais, podendo exigir a <strong>eliminação, bloqueio ou anonimização</strong> de dados desnecessários, excessivos ou tratados em desconformidade com a Lei Geral de Proteção de Dados. (art. 18, IV).</p>
            </li>
            <li>
                <strong>Oposição</strong>
                <p>É o direito de, a qualquer momento, <strong>opor-se ao tratamento de dados</strong> por motivos relacionados com a sua situação particular, em caso de descumprimento ao disposto na Lei Geral de Proteção de Dados. (art. 18, § 2º).</p>
            </li>
            <li>
                <strong>Portabilidade de dados</strong>
                <p>É o direito de <strong>realizar a portabilidade dos dados a outro fornecedor de serviço ou produto</strong>, mediante requisição expressa, de acordo com a regulamentação da autoridade nacional, observados os segredos comercial e industrial. (art. 18, V).</p>
            </li>
        </ol>
        <h4>Seus deveres</h4>
        <span className="self-center">Assim como possui direitos, você também tem obr/igações ao utilizar um serviço do Grupo PWR, sendo eles: </span><br/>
        <ol className="list-decimal marker:font-bold" start={6}>
            <li>
                <strong>Zelar pela veracidade das informações</strong>
                <p>Caso os dados informados não possuam veracidade e precisão, pode ser que não consiga utilizar o serviço oferecido. Você, como usuário do serviço, é responsável pela atualização das suas informações pessoais e pelas consequências da omissão ou erros nas informações pessoais cadastradas.</p>
            </li>
            <li>
                <strong>Responsabilidade pelos seus atos</strong>
                <p>É sua exclusiva responsabilidade a reparação de todo e qualquer dano, direto ou indireto, que seja causado à Administração Pública, outro usuário, ou terceiro (inclusive em virtude do descumprimento do disposto neste Termo de Uso ou de qualquer ato praticado a partir de seu acesso ao serviço), em razão da violação de quaisquer dos seus deveres previstos nestes Termos de Uso e/ou da legislação aplicável.
                    Da mesma forma, o Grupo PWR não é obr/igado a processar ou tratar quaisquer dados que tenha razões para crer que referido processamento ou tratamento possa ocasionar a imputação de qualquer infração às legislações aplicáveis, ou se o Usuário estiver utilizando a plataforma digital para quaisquer fins ilegais ou ilícitos.</p>
            </li>
        </ol>
        <h4>Nossos Compromissos</h4>
        <span className="self-center">No Grupo PWR, comprometemo-nos em oferecer serviços de alta qualidade, primando pela inovação, segurança e eficácia em cada etapa do processo. Nossos compromissos fundamentais incluem:</span>
        <ol className="list-[upper-alpha] marker:font-bold">
            <li>
                <strong>Qualidade e Segurança:</strong>
                <p>Comprometemo-nos a seguir os mais altos padrões de qualidade em todas as fases de execução dos nossos serviços. Isso inclui a adoção de práticas rigorosas de controle de qualidade e conformidade com as regulamentações locais e internacionais.</p>
            </li>
            <li>
                <strong>Acesso e Disponibilidade:</strong>
                <p>Trabalhamos para garantir o acesso equitativo aos nossos produtos, visando atender às necessidades dos clientes e parceiros de maneira eficaz e oportuna.</p>
            </li>
            <li>
                <strong>Transparência e Ética:</strong>
                <p>Mantemos uma postura de transparência em nossas ações e processos. Seguimos um código ético rígido, cumprindo todas as leis e regulamentos aplicáveis aos nossos serviços.<br/>
                    Além disso, o Grupo PWR se compromete a observar os princípios de proteção de dados estabelecidos no art. 6° da Lei Geral de Proteção de Dados, a cumprir todas as legislações inerentes ao uso correto dos dados pessoais do cidadão de forma a preservar a privacidade dos dados utilizados no serviço, bem como a garantir todos os direitos e garantias legais que você possui. É nossa responsabilidade implementar controles de segurança para proteção dos dados que são coletados.</p>
            </li>
        </ol>
        <h4>Dados de Cadastro e finalidade de tratamento</h4>
        <p>Quaisquer dados coletados, serão utilizados para finalidade de contato com você para que possamos atender à solicitação feita com relação aos serviços oferecidos por nós.<br/><br/>
            Tais dados também serão utilizados com a finalidade de envio de e-mail marketing, para que você possa se manter informado sobr/e nossos serviços e sobr/e as atualizações do mundo empresarial, mudança de legislação e outros.
        </p>
        <h4>CORREÇÃO E ALTERAÇÃO DE DADOS</h4>
        <p>Prezando pelo melhor atendimento a você, usuário de nossos serviços, informamos que é seu direito requerer o cancelamento do seu cadastro e exclusão dos seus dados coletados, a qualquer momento.<br/><br/>
            Caso a coleta tenha se dado por meio do seu consentimento, a solicitação será atendida de forma imediata. Mas, caso a finalidade de tratamento dos dados objeto da solicitação esteja atrelada à prestação de serviço que exija o seu armazenamento em razão de obr/igação legal, cumprimento de contrato, exercício regular do direito em processo ou outro motivo que impeça a empresa de fazê-lo, os dados serão mantidos em nossa base de dados e você será informado da justificativa.
        </p>
        <h4>Cancelamento de cadastro e exclusão dos dados</h4>
        <p>
            Prezando pelo melhor atendimento a você, usuário de nossos serviços, informamos que é seu direito requerer o cancelamento do seu cadastro e exclusão dos seus dados coletados, a qualquer momento.<br/><br/>
            Caso a coleta tenha se dado por meio do seu consentimento, a solicitação será atendida de forma imediata. Mas, caso a finalidade de tratamento dos dados objeto da solicitação esteja atrelada à prestação de serviço que exija o seu armazenamento em razão de obr/igação legal, cumprimento de contrato, exercício regular do direito em processo ou outro motivo que impeça a empresa de fazê-lo, os dados serão mantidos em nossa base de dados e você será informado da justificativa.
        </p>
        <br/><br/>
        <h4>Condições gerais</h4>
        <p>
            Ao utilizar os nossos serviços, você declara estar de acordo com os termos descritos. Se você não concordar com qualquer condição estabelecida, você não deverá acessar e/ou usar as ferramentas do Grupo PWR.<br/><br/>
            O Grupo PWR poderá alterar os termos de uso a qualquer tempo. Você deverá revê-los regularmente para garantir que estará sempre ciente de todas as alterações implementadas.<br/><br/>
            O presente Termo de uso será interpretado de acordo com as leis br/asileiras, ficando eleito o foro da Comarca de Fortaleza/CE para dirimir qualquer controvérsia.
        </p>
        <br/><br/>
        <h4>Nosso canal de comunicação</h4>
        <div>
            <span className='text-16 w-fit'>automacao@pwrgestao.com</span>
            <EnvelopeClosedIcon/>
        </div>
        <br/><br/><br/>     
    </main>
    )
}