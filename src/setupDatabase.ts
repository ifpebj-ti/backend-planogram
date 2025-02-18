import { PrismaClient, NivelDeAcesso } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';

dotenv.config(); 

const prisma = new PrismaClient();

async function main() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error('❌ Variáveis ADMIN_EMAIL ou ADMIN_PASSWORD não estão definidas no .env!');
    }

    let usuario = await prisma.usuario.findUnique({ where: { email: adminEmail } });
    const hashedPassword = await bcrypt.hash(adminPassword, 12); 

    if (!usuario) {
      usuario = await prisma.usuario.create({
        data: {
          email: adminEmail,
          nome: 'Administrador',
          senha: hashedPassword,
          nivel_de_acesso: NivelDeAcesso.admin,
        },
      });
      console.log('Usuário criado.');
    } else {
      console.log('Usuário já existe.');
    }

    const prateleirasData = [{ nome: 'Prateleira A' }, { nome: 'Prateleira B' }];
    const prateleiras = [];

    for (const data of prateleirasData) {
      let prateleira = await prisma.prateleira.findFirst({ where: { nome: data.nome } });
      if (!prateleira) {
        prateleira = await prisma.prateleira.create({ data });
        console.log(`${data.nome} criada.`);
      } else {
        console.log(`${data.nome} já existe.`);
      }
      prateleiras.push(prateleira);
    }

    const categoriasData = [
      { nome: 'Higiene', venda_total_dia: 10, id_prateleira: prateleiras[0].id },
      { nome: 'Medicamentos', venda_total_dia: 20, id_prateleira: prateleiras[0].id },
      { nome: 'Cosméticos', venda_total_dia: 15, id_prateleira: prateleiras[1].id },
    ];

    const categorias = [];
    for (const data of categoriasData) {
      let categoria = await prisma.categoria.findFirst({ where: { nome: data.nome } });
      if (!categoria) {
        categoria = await prisma.categoria.create({ data: { ...data, usuarioId: usuario.id } });
        console.log(`Categoria "${data.nome}" criada.`);
      } else {
        console.log(`Categoria "${data.nome}" já existe.`);
      }
      categorias.push(categoria);
    }

    const produtosData = [
      { nome: 'Shampoo', preco: 15.99, fornecedor: 'Fornecedor A', quantidade: 50, venda_por_dia: 5, id_categoria: categorias[0].id },
      { nome: 'Sabonete', preco: 4.99, fornecedor: 'Fornecedor B', quantidade: 100, venda_por_dia: 8, id_categoria: categorias[0].id },
      { nome: 'Paracetamol', preco: 9.99, fornecedor: 'Fornecedor C', quantidade: 200, venda_por_dia: 15, id_categoria: categorias[1].id },
      { nome: 'Dipirona', preco: 7.99, fornecedor: 'Fornecedor C', quantidade: 150, venda_por_dia: 12, id_categoria: categorias[1].id },
      { nome: 'Batom', preco: 24.99, fornecedor: 'Fornecedor D', quantidade: 80, venda_por_dia: 7, id_categoria: categorias[2].id },
      { nome: 'Perfume', preco: 99.99, fornecedor: 'Fornecedor E', quantidade: 40, venda_por_dia: 3, id_categoria: categorias[2].id },
    ];

    for (const data of produtosData) {
      const produto = await prisma.produto.findFirst({ where: { nome: data.nome } });
      if (!produto) {
        await prisma.produto.create({ data: { ...data, usuarioId: usuario.id } });
        console.log(`Produto "${data.nome}" criado.`);
      } else {
        console.log(`Produto "${data.nome}" já existe.`);
      }
    }
  } catch (error) {
    console.error('Erro ao rodar o seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
