const {PrismaClient} =require("@prisma/client");
const db =new PrismaClient();

async function main() {
    try{
        await db.category.createMany({
            data:[
                { name: "Famous People"},
                { name: "Inspirational"},
                { name: "Motivational"},
                { name: "Funny"},
                { name: "Movies & TV"},
                { name: "Musicians"},
                { name: "Games"},
                { name: "Animals"},
                { name: "Philosophy"},
                { name: "Scientists"},
                { name: "Billionaires"},

            ]})
    }catch(error){
        console.log("Error seeding default categories",error);
    }finally{
        await db.$disconnect();
    }
}
main();