import UIKit
import BrightFutures

class ViewController: UITableViewController {
    
    var pokemon: [PokemonSummary] = []

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        let dataSource = PokemonDataSource()
        dataSource.getFirst150Pokemon()
            .onSuccess { pokemon in
                print("SUCCESS")
                pokemon.forEach { p in
                    print("\(p.id) - \(p.name)")
                }
                self.pokemon = pokemon
                self.tableView.reloadData()
            }.onFailure { error in
                print("ERROR")
                print(error.domain)
                print(error.code)
                print(error.userInfo)
            }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return pokemon.count
    }
    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("PokemonCell", forIndexPath: indexPath)
        
        let pokeman = pokemon[indexPath.row]
        cell.imageView?.image = UIImage(named: String(pokeman.id))
        cell.textLabel?.text = pokeman.name
        return cell
    }


}

